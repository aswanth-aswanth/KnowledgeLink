import ShortRepository from '../repositories/ShortRepository';
import UserRepository from '../repositories/UserRepository';
import { IShort, IShortWithIsLiked } from '../../infra/databases/mongoose/models/Short';
import { IUser } from '../../infra/databases/mongoose/models/User';

export default class GetRecommendedShorts {
    private shortRepository: ShortRepository;
    private userRepository: UserRepository;

    constructor(shortRepository: ShortRepository, userRepository: UserRepository) {
        this.shortRepository = shortRepository;
        this.userRepository = userRepository;
    }

    public async execute(userId: string | null, limit: number = 10): Promise<IShortWithIsLiked[]> {
        const allShorts = await this.shortRepository.getAll();

        if (!userId) {
            return this.getRandomShorts(allShorts, limit) as IShortWithIsLiked[];
        }

        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const scoredShorts = await this.scoreShorts(user, allShorts);
        const recommendedShorts = scoredShorts.slice(0, limit);

        return recommendedShorts.map(short => ({
            ...short.short.toObject(),
            isLiked: short.short.likes.includes(userId)
        })) as unknown as IShortWithIsLiked[];
    }

    private getRandomShorts(shorts: IShort[], limit: number): IShort[] {
        const shuffled = shorts.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, limit);
    }

    private async scoreShorts(user: IUser, shorts: IShort[]): Promise<{ short: IShort; score: number }[]> {
        const userTagPreferences = await this.getUserTagPreferences(user);
        return shorts.map(short => ({
            short,
            score: this.calculateScore(user, short, userTagPreferences)
        })).sort((a, b) => b.score - a.score);
    }

    private calculateScore(user: IUser, short: IShort, userTagPreferences: { [key: string]: number }): number {
        let score = 0;

        // Factor 1: User's tag preferences
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
        if (!user.viewedShorts.includes((short._id as any).toString())) {
            score += 5;
        }

        return score;
    }

    private async getUserTagPreferences(user: IUser): Promise<{ [key: string]: number }> {
        const tagPreferences: { [key: string]: number } = {};
        for (const shortId of user.likedShorts) {
            const short = await this.shortRepository.findById(shortId);
            short?.tags?.forEach(tag => {
                tagPreferences[tag] = (tagPreferences[tag] || 0) + 1;
            });
        }
        return tagPreferences;
    }
}