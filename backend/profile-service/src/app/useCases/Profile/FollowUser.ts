import UserRepository from '../../repositories/UserRepository';

export default class FollowUser {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    public async execute(followerUserId: string, followeeUserId: string): Promise<object> {
        if (followerUserId === followeeUserId) {
            throw new Error("You cannot follow yourself");
        }

        const follower = await this.userRepository.findById(followerUserId);
        const followee = await this.userRepository.findById(followeeUserId);

        if (!follower || !followee) {
            throw new Error("User not found");
        }

        // Ensure 'following' is initialized as an array
        follower.following = follower.following || [];
        followee.followers = followee.followers || [];

        const isFollowing = follower.following.includes(followeeUserId);

        if (isFollowing) {
            follower.following = follower.following.filter(id => id !== followeeUserId);
            followee.followers = followee.followers.filter(id => id !== followerUserId);
        } else {
            follower.following.push(followeeUserId);
            followee.followers.push(followerUserId);
        }

        await this.userRepository.save(follower);
        await this.userRepository.save(followee);

        return {
            followerUserId,
            followeeUserId,
            following: !isFollowing
        };
    }
}
