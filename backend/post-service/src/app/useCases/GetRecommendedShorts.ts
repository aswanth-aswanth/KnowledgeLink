import ShortRepository from '../repositories/ShortRepository';
import UserRepository from '../repositories/UserRepository';
import { IShort } from '../../infra/databases/mongoose/models/Short';
import { IUser } from '../../infra/databases/mongoose/models/User';

export default class GetRecommendedShorts {
    private shortRepository: ShortRepository;
    private userRepository: UserRepository;

    constructor(shortRepository: ShortRepository, userRepository: UserRepository) {
        this.shortRepository = shortRepository;
        this.userRepository = userRepository;
    }

    public async execute(userId: string | null, limit: number = 10): Promise<IShort[]> {
        const allShorts = await this.shortRepository.getAll();

        if (!userId) {
            // For non-logged in users, return random shorts
            return this.getRandomShorts(allShorts, limit);
        }

        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const scoredShorts = this.scoreShorts(user, allShorts);
        const recommendedShorts = scoredShorts.slice(0, limit);

        return recommendedShorts.map(short => ({
            ...short.short.toObject(),
            isLiked: short.short.likes.includes(userId)
        }));
    }

    private getRandomShorts(shorts: IShort[], limit: number): IShort[] {
        const shuffled = shorts.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, limit);
    }

    private scoreShorts(user: IUser, shorts: IShort[]): { short: IShort; score: number }[] {
        return shorts.map(short => ({
            short,
            score: this.calculateScore(user, short)
        })).sort((a, b) => b.score - a.score);
    }

    private calculateScore(user: IUser, short: IShort): number {
        let score = 0;

        // Factor 1: User's tag preferences
        const userTagPreferences = this.getUserTagPreferences(user);
        short.tags?.forEach(tag => {
            if (userTagPreferences[tag]) {
                score += userTagPreferences[tag];
            }
        });

        // Factor 2: Video popularity
        score += short.views * 0.01;
        score += short.likes.length * 0.1;

        // Factor 3: Recency
        const daysSinceCreation = (Date.now() - short.createdAt.getTime()) / (1000 * 3600 * 24);
        score += Math.max(0, 10 - daysSinceCreation); // Boost newer content

        // Factor 4: User hasn't seen this short before
        if (!user.viewedShorts.includes(short._id)) {
            score += 5;
        }

        return score;
    }

    private getUserTagPreferences(user: IUser): { [key: string]: number } {
        const tagPreferences: { [key: string]: number } = {};
        user.likedShorts.forEach(shortId => {
            const short = this.shortRepository.findById(shortId);
            short.tags?.forEach(tag => {
                tagPreferences[tag] = (tagPreferences[tag] || 0) + 1;
            });
        });
        return tagPreferences;
    }
}