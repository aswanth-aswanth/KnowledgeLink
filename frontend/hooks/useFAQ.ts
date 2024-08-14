import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import apiClient from '@/api/apiClient';
import { FAQ } from '@/types/roadmap';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

interface UseFAQProps {
    roadmapId: string;
    topicUniqueId: string;
    topicId: string;
}

export const useFAQ = ({ roadmapId, topicUniqueId, topicId }: UseFAQProps) => {
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [newQuestion, setNewQuestion] = useState('');
    const [expandedFAQs, setExpandedFAQs] = useState<string[]>([]);
    const [newAnswers, setNewAnswers] = useState<{ [key: string]: string }>({});
    const answerRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
    const [activeTab, setActiveTab] = useState<'faq' | 'ai'>('faq');
    const [aiResponse, setAIResponse] = useState<string | null>(null);
    const [isAILoading, setIsAILoading] = useState(false);

    useEffect(() => {
        fetchFAQs();
    }, [roadmapId, topicUniqueId]);

    const fetchFAQs = async () => {
        try {
            const response = await apiClient.get(
                `/profile/faq/${roadmapId}/${topicUniqueId}`
            );
            setFaqs(response.data);
        } catch (error) {
            console.error('Error fetching FAQs:', error);
            toast.error('Failed to fetch FAQs. Please try again.');
        }
    };

    const askAI = async (question: string) => {
        setIsAILoading(true);
        try {
            const result = await model.generateContent(question);
            const response = result.response;
            const text = response.text();
            setIsAILoading(false);
            return text;
        } catch (error) {
            console.error('Error generating content:', error);
            setIsAILoading(false);
            throw error;
        }
    };

    const submitQuestion = async () => {
        if (!newQuestion.trim()) return;

        try {
            if (activeTab === 'faq') {
                await apiClient.post('/profile/faq/question', {
                    roadmapId,
                    topicUniqueId,
                    topicId,
                    question: newQuestion,
                });
                fetchFAQs();
                toast.success('Your question has been successfully submitted.');
            } else {
                const response = await askAI(newQuestion);
                setAIResponse(response);
                toast.success('AI has provided an answer.');
            }
            setNewQuestion('');
        } catch (error) {
            console.error('Error submitting question:', error);
            toast.error('Failed to submit your question. Please try again.');
        }
    };

    const toggleFAQ = (faqId: string) => {
        setExpandedFAQs((prev) =>
            prev.includes(faqId)
                ? prev.filter((id) => id !== faqId)
                : [...prev, faqId]
        );
    };

    const handleAnswerChange = (faqId: string, content: string) => {
        setNewAnswers((prev) => ({ ...prev, [faqId]: content }));
    };

    const submitAnswer = async (faqId: string) => {
        const content = newAnswers[faqId];
        if (!content || !content.trim()) return;

        try {
            await apiClient.post('/profile/faq/answer', {
                faqId,
                content,
            });
            setNewAnswers((prev) => ({ ...prev, [faqId]: '' }));
            if (answerRefs.current[faqId]) {
                answerRefs.current[faqId]!.textContent = '';
            }
            fetchFAQs();
            toast.success('Your answer has been successfully submitted.');
        } catch (error) {
            console.error('Error submitting answer:', error);
            toast.error('Failed to submit your answer. Please try again.');
        }
    };

    return {
        faqs,
        newQuestion,
        setNewQuestion,
        expandedFAQs,
        newAnswers,
        answerRefs,
        activeTab,
        setActiveTab,
        aiResponse,
        isAILoading,
        askAI,
        submitQuestion,
        toggleFAQ,
        handleAnswerChange,
        submitAnswer,
    };
};