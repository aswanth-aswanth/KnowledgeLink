import { IPost } from '../../infra/databases/mongoose/models/Post';
import PostRepository from '../repositories/PostRepository';

export default class CommentPost {
    private postRepository: PostRepository;

    constructor(postRepository: PostRepository) {
        this.postRepository = postRepository;
    }

    public async execute(postId: string, email: string, text: string): Promise<any> {
        return await this.postRepository.commentPost(postId, email, text);
    }
}