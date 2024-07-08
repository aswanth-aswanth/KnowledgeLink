import { IPost } from '../../infra/databases/mongoose/models/Post';
import PostRepository from '../repositories/PostRepository';

export default class DeleteComment {
    private postRepository: PostRepository;

    constructor(postRepository: PostRepository) {
        this.postRepository = postRepository;
    }

    public async execute(commentId: string, email: string): Promise<any> {
        return await this.postRepository.deleteComment(commentId, email);
    }
}