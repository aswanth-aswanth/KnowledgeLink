// src/app/useCases/CreatePost.ts

import { IPost } from '../../infra/databases/mongoose/models/Post';
import PostRepository from '../repositories/PostRepository';
import { File } from 'formidable';

export default class CreatePost {
    private postRepository: PostRepository;

    constructor(postRepository: PostRepository) {
        this.postRepository = postRepository;
    }

    public async execute(post: IPost, files: File[]): Promise<IPost> {
        return await this.postRepository.create(post, files);
    }
}