import PostRepository from '../repositories/PostRepository';

export default class GetReplies {
    private postRepository: PostRepository;

    constructor(postRepository: PostRepository) {
        this.postRepository = postRepository;
    }

    public async execute(commentId: string, page: number, limit: number): Promise<any> {
        return this.postRepository.getReplies(commentId, page, limit);
    }
}
