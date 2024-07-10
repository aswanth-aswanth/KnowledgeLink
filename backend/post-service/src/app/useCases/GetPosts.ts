import PostRepository from '../repositories/PostRepository';
import Publisher from '../../infra/messaging/rabbitmq/Publisher';

export default class GetPosts {
    private postRepository: PostRepository;

    constructor(postRepository: PostRepository) {
        this.postRepository = postRepository;
    }

    public async execute(currentUserEmail: string): Promise<any> {
        try {
            const message = JSON.stringify({ email: currentUserEmail });
            const response = await Publisher.publishAndWait('profile_queue2', message);
            const { following } = JSON.parse(response);
            console.log("Following : ", following);

            if (!following || following.length === 0) {
                return [];
            }

            const posts = await this.postRepository.getPosts(currentUserEmail, following);
            return posts;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error("Failed to get posts: " + error.message);
            }
            throw new Error("Unknown error");
        }
    }
}