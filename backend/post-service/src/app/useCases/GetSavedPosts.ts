import PostRepository from '../repositories/PostRepository';
import Publisher from '../../infra/messaging/rabbitmq/Publisher';

export default class GetSavedPosts {
    private postRepository: PostRepository;

    constructor(postRepository: PostRepository) {
        this.postRepository = postRepository;
    }

    public async execute(userId: string): Promise<any> {
        try {
            const message = JSON.stringify({ userId });
            const response = await Publisher.publishAndWait('get_saved_posts_queue', message);
            const { savedPosts } = JSON.parse(response);

            if (!savedPosts || savedPosts.length === 0) {
                return [];
            }

            const posts = await this.postRepository.findPostsByIds(savedPosts, userId);
            return posts;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error("Failed to get saved posts: " + error.message);
            }
            throw new Error("Unknown error");
        }
    }
}
