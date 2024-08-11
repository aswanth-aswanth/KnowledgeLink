import { IPost } from '../../infra/databases/mongoose/models/Post';
import PostRepository from '../repositories/PostRepository';
import Publisher from '../../infra/messaging/rabbitmq/Publisher';

export default class LikePost {
    private postRepository: PostRepository;

    constructor(postRepository: PostRepository) {
        this.postRepository = postRepository;
    }

    public async execute(postId: string, userId: string, username: string): Promise<any> {
        const { post, liked } = await this.postRepository.toggleLike(postId, userId);

        if (liked) {
            const notificationMessage = JSON.stringify({
                type: 'like',
                postId,
                liker: username,
                postOwner: "post.creatorEmail"
            });
            await Publisher.publish('notification_exchange', notificationMessage);
        }

        return "success";
    }
}
