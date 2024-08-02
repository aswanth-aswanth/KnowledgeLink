import PostRepository from '../repositories/PostRepository';

export default class GetUserPosts {
    private postRepository: PostRepository;

    constructor(postRepository: PostRepository) {
        this.postRepository = postRepository;
    }

    public async execute(postId: string, currentUserEmail: string): Promise<any> {
        return this.postRepository.getUserPost(postId, currentUserEmail);
    }
}
