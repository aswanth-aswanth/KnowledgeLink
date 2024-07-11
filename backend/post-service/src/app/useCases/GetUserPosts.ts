import PostRepository from '../repositories/PostRepository';

export default class GetUserPosts {
    private postRepository: PostRepository;

    constructor(postRepository: PostRepository) {
        this.postRepository = postRepository;
    }

    public async execute(userEmail: string, currentUserEmail: string, page: number, limit: number): Promise<any> {
        return this.postRepository.getUserPosts(userEmail, currentUserEmail, page, limit);
    }
}
