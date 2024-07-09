import { IPost } from '../../infra/databases/mongoose/models/Post';
import PostRepository from '../repositories/PostRepository';
import Publisher from '../../infra/messaging/rabbitmq/Publisher';
export default class CommentPost {
    private postRepository: PostRepository;

    constructor(postRepository: PostRepository) {
        this.postRepository = postRepository;
    }

    public async execute(postId: string, email: string, text: string): Promise<any> {
        const result = await this.postRepository.commentPost(postId, email, text);
        const notificationMessage = JSON.stringify({
            type: 'comment',
            postId,
            commenter: email,
            postOwner: result.creatorEmail
        });
        await Publisher.publish('notification_exchange', notificationMessage);
        return result;
    }
}