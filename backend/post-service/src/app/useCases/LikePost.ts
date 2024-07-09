import { IPost } from '../../infra/databases/mongoose/models/Post';
import PostRepository from '../repositories/PostRepository';
import Publisher from '../../infra/messaging/rabbitmq/Publisher';


export default class LikePost {
    private postRepository: PostRepository;

    constructor(postRepository: PostRepository) {
        this.postRepository = postRepository;
    }

    public async execute(postId: string, email: string): Promise<IPost> {
        const result = await this.postRepository.toggleLike(postId, email);

        const notificationMessage = JSON.stringify({
            type: 'like',
            postId,
            liker: email,
            postOwner: result.creatorEmail
        });
        await Publisher.publish('notification_exchange', notificationMessage);

        return result;
    }
}