import { IPost } from '../../infra/databases/mongoose/models/Post';
import PostRepository from '../repositories/PostRepository';
import Publisher from '../../infra/messaging/rabbitmq/Publisher';
export default class CommentPost {
    private postRepository: PostRepository;

    constructor(postRepository: PostRepository) {
        this.postRepository = postRepository;
    }

    public async execute(postId: string, userId: string, text: string): Promise<any> {
        const result = await this.postRepository.commentPost(postId, userId, text);
        const notificationMessage = JSON.stringify({
            type: 'comment',
            postId,
            commenter: userId,
            postOwner: result.creatorId
        });
        await Publisher.publish('notification_exchange', notificationMessage);
        return "Commented successfully";
    }
}