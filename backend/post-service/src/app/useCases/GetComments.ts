import PostRepository from '../repositories/PostRepository';

export default class GetComments {
    private postRepository: PostRepository;

    constructor(postRepository: PostRepository) {
        this.postRepository = postRepository;
    }

    public async execute(postId: string, page: number, limit: number): Promise<any> {
        return this.postRepository.getComments(postId, page, limit);
    }
}
