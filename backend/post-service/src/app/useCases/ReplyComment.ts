// src/app/useCases/CreatePost.ts

import { IPost } from '../../infra/databases/mongoose/models/Post';
import PostRepository from '../repositories/PostRepository';

export default class ReplyComment {
    private postRepository: PostRepository;

    constructor(postRepository: PostRepository) {
        this.postRepository = postRepository;
    }

    public async execute(commentId: string, email: string, text: string): Promise<any> {
        return await this.postRepository.addReply(commentId, text, email);
    }
}