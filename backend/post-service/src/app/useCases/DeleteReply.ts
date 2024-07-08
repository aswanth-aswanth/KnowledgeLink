import { IPost } from '../../infra/databases/mongoose/models/Post';
import PostRepository from '../repositories/PostRepository';

export default class DeleteReply {
    private postRepository: PostRepository;

    constructor(postRepository: PostRepository) {
        this.postRepository = postRepository;
    }

    public async execute(commentId: string, replyId: string, email: string): Promise<any> {
        return await this.postRepository.deleteReply(commentId, replyId, email);
    }
}