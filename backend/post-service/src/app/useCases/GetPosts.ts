import PostRepository from '../repositories/PostRepository';
import Publisher from '../../infra/messaging/rabbitmq/Publisher';

export default class GetPosts {
    private postRepository: PostRepository;

    constructor(postRepository: PostRepository) {
        this.postRepository = postRepository;
    }

    public async execute(currentUserId: string): Promise<any> {
        try {
            const message = JSON.stringify({ userId: currentUserId });
            const response = await Publisher.publishAndWait('profile_queue2', message);
            const { following } = JSON.parse(response);

            if (!following || following.length === 0) {
                return [];
            }

            const posts = await this.postRepository.getPosts(currentUserId, following);
            return posts;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error("Failed to get posts: " + error.message);
            }
            throw new Error("Unknown error");
        }
    }
}