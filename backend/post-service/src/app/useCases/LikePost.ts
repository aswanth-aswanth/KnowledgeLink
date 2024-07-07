// src/app/useCases/CreatePost.ts

import { IPost } from '../../infra/databases/mongoose/models/Post';
import PostRepository from '../repositories/PostRepository';

export default class LikePost {
    private postRepository: PostRepository;

    constructor(postRepository: PostRepository) {
        this.postRepository = postRepository;
    }

    public async execute(postId: string, email: string): Promise<IPost> {
        return await this.postRepository.toggleLike(postId, email);
    }
}