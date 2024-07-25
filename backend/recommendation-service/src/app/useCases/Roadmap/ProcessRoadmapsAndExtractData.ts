import RoadmapRepository from '../../repositories/RoadmapRepository';
import ExtractedData from '../../../infra/databases/mongoose/models/ExtractedData';
import { IRoadmap, ITopic } from '../../../infra/databases/interfaces/IRoadmap';
import natural from 'natural';
import nlp from 'compromise';

export default class ProcessRoadmapsAndExtractData {
    private roadmapRepository: RoadmapRepository;

    constructor(roadmapRepository: RoadmapRepository) {
        this.roadmapRepository = roadmapRepository;
    }

    public async execute(): Promise<void> {
        try {
            const roadmaps = await this.roadmapRepository.findAllRoadmaps();
            for (const roadmap of roadmaps) {
                await this.processRoadmap(roadmap);
            }
        } catch (error) {
            if (error instanceof Error) {
                throw new Error("Failed to process roadmaps and extract data: " + error.message);
            }
            throw new Error("Unknown error occurred while processing roadmaps");
        }
    }

    private async processRoadmap(roadmap: IRoadmap): Promise<void> {
        const processTopics = async (topic: ITopic) => {
            if (topic.content && topic.name && topic.uniqueId) {
                const extractedData = this.extractData(topic.content, topic.name, topic.uniqueId);
                await ExtractedData.create({
                    roadmapId: roadmap._id,
                    topicId: topic._id,
                    ...extractedData
                });
            }

            if (topic.children && topic.children.length > 0) {
                for (const child of topic.children) {
                    await processTopics(child);
                }
            }
        };

        await processTopics(roadmap.topics);
    }

    private extractData(text: string, name: string, uniqueId: string): any {
        const TfIdf = natural.TfIdf;
        const tokenizer = new natural.WordTokenizer();
        const doc = nlp(text);
        const tfidf = new TfIdf();
        tfidf.addDocument(text);

        const tokens = tokenizer.tokenize(text);
        const tagScores = tokens.map(token => ({
            word: token.toLowerCase(),
            score: tfidf.tfidf(token, 0)
        }));

        const entities = doc.topics().json({ normal: true, count: true });
        const nounPhrases = doc.nouns().out('array');
        const verbs = doc.verbs().out('array');

        const words = tokens.length;
        const sentences = doc.sentences().length;
        const avgWordsPerSentence = words / sentences;
        const syllables = this.countSyllables(text);
        const fleschKincaidReadability = 206.835 - 1.015 * avgWordsPerSentence - 84.6 * (syllables / words);

        return {
            uniqueId,
            name,
            summary: this.summarize(text),
            tags: tagScores.sort((a, b) => b.score - a.score).slice(0, 10).map(t => t.word),
            entities: entities.map((e: any) => ({ name: e.normal, count: e.count })),
            nounPhrases: nounPhrases.slice(0, 10),
            verbs: verbs.slice(0, 10),
            readabilityMetrics: {
                wordCount: words,
                sentenceCount: sentences,
                avgWordsPerSentence,
                syllableCount: syllables,
                fleschKincaidReadability
            },
            dates: this.extractDates(doc),
            topics: this.extractTopics(text),
            contentLength: text.length,
            paragraphCount: text.split('\n\n').length,
            sentiment: this.analyzeSentiment(text),
            questionCount: (text.match(/\?/g) || []).length,
            exclamationCount: (text.match(/!/g) || []).length,
            hasCode: /```[\s\S]*?```/.test(text) || /`[\s\S]*?`/.test(text),
            headings: this.extractHeadings(text),
            links: this.extractLinks(text),
            languageDetection: this.detectLanguage(text)
        };
    }

    private summarize(text: string, sentenceCount: number = 2): string {
        const sentences = text.match(/[^\.!\?]+[\.!\?]+/g);
        if (!sentences || sentences.length <= sentenceCount) return text;

        const tfidf = new natural.TfIdf();
        sentences.forEach(s => tfidf.addDocument(s));

        const sentenceScores = sentences.map((s, i) => ({
            sentence: s,
            score: tfidf.tfidf(s, i)
        }));

        sentenceScores.sort((a, b) => b.score - a.score);
        return sentenceScores.slice(0, sentenceCount).map(s => s.sentence).join(' ');
    }

    private extractTopics(text: string): Array<{ term: string; score: number }> {
        const tfidf = new natural.TfIdf();
        tfidf.addDocument(text);

        return Object.entries(tfidf.listTerms(0))
            .sort((a, b) => {
                const scoreA = typeof a[1] === 'number' ? a[1] : a[1].tfidf;
                const scoreB = typeof b[1] === 'number' ? b[1] : b[1].tfidf;
                return scoreB - scoreA;
            })
            .slice(0, 5)
            .map(([term, score]) => ({
                term,
                score: typeof score === 'number' ? score : score.tfidf
            }));
    }

    private analyzeSentiment(text: string): number {
        const analyzer = new natural.SentimentAnalyzer('English', natural.PorterStemmer, 'afinn');
        return analyzer.getSentiment(new natural.WordTokenizer().tokenize(text));
    }

    private extractHeadings(text: string): string[] {
        const headingRegex = /#{1,6}\s+(.+)/g;
        const headings = [];
        let match;
        while ((match = headingRegex.exec(text)) !== null) {
            headings.push(match[1]);
        }
        return headings;
    }

    private extractLinks(text: string): Array<{ text: string; url: string }> {
        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        const links = [];
        let match;
        while ((match = linkRegex.exec(text)) !== null) {
            links.push({ text: match[1], url: match[2] });
        }
        return links;
    }

    private detectLanguage(text: string): string[] {
        // Implement your own language detection logic here
        // or use a different library that's compatible with your setup
        return ['en']; // Placeholder return
    }

    private countSyllables(text: string): number {
        // Implement your own syllable counting logic here
        // This is a simple placeholder implementation
        return text.split(/\s+/).length;
    }

    private extractDates(doc: any): any[] {
        // Implement your own date extraction logic here
        // This is a placeholder implementation
        return [];
    }
}