export interface User {
    _id?: string;
    username?: string;
    email?: string;
    image?: string;
    followersCount?: number;
    followingCount?: number;
    isFollowing?: boolean;
}
