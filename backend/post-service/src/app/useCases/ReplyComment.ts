import { IPost } from '../../infra/databases/mongoose/models/Post';
import PostRepository from '../repositories/PostRepository';
import Publisher from '../../infra/messaging/rabbitmq/Publisher';

export default class ReplyComment {
    private postRepository: PostRepository;

    constructor(postRepository: PostRepository) {
        this.postRepository = postRepository;
    }

    public async execute(commentId: string, email: string, text: string): Promise<any> {
        const result = await this.postRepository.addReply(commentId, text, email);
        const notificationMessage = JSON.stringify({
            type: 'reply',
            commentId,
            replier: email,
            commentOwner: result.author 
        });
        await Publisher.publish('notification_exchange', notificationMessage);
        return "Success";
    }
}