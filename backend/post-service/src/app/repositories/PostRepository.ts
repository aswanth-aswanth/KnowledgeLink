import Post, { IPost } from '../../infra/databases/mongoose/models/Post';
import Comment, { IComment } from '../../infra/databases/mongoose/models/Comment';
import S3Service from '../../infra/services/S3Service';
import { File } from 'formidable';
import mongoose from 'mongoose';


export default class PostRepository {
    private s3Service: S3Service;

    constructor() {
        this.s3Service = new S3Service();
    }

    public async create(post: IPost, files: File[]): Promise<IPost> {
        try {
            const uploadPromises = files.map(file => {
                const folder = file.mimetype?.startsWith('image') ? 'images' :
                    file.mimetype?.startsWith('video') ? 'videos' : 'audios';
                return this.s3Service.uploadFile(file, folder);
            });

            const uploadedUrls = await Promise.all(uploadPromises);
            console.log("repo post : ", post);
            console.log("repo files : ", files);

            const newPost = new Post({
                ...post,
                content: {
                    videos: uploadedUrls.filter(url => url.includes('/videos/')).map(url => ({
                        type: 'videoFile',
                        url,
                        duration: 0 // You might want to implement duration extraction
                    })),
                    images: uploadedUrls.filter(url => url.includes('/images/')).map(url => ({ url }))
                },
                audios: uploadedUrls.filter(url => url.includes('/audios/'))
            });

            await newPost.save();
            return newPost;
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Error creating post: ${error.message}`);
                throw new Error('Failed to create post');
            } else {
                console.error('Unknown error creating post');
                throw new Error('Unknown error');
            }
        }
    }
    public async toggleLike(postId: string, email: string) {
        try {
            const post = await Post.findById(postId);
            if (!post) {
                throw new Error('Post not found');
            }

            const likeIndex = post.likes.indexOf(email);
            if (likeIndex === -1) {
                // User hasn't liked the post, so like it
                post.likes.push(email);
            } else {
                // User already liked the post, so unlike it
                post.likes.splice(likeIndex, 1);
            }

            await post.save();
            return post;
        } catch (error) {
            console.error('Error toggling like:', error);
            throw error;
        }
    }
    public async commentPost(postId: string, email: string, text: string) {
        try {
            const post = await Post.findById(postId);
            if (!post) {
                throw new Error('Post not found');
            }

            const comment = new Comment({ text, author: email, replies: [] });
            await comment.save();

            post.comments.push(comment._id);
            return await post.save();

        } catch (error) {
            console.error('Error toggling like:', error);
            throw error;
        }
    }
    public async addReply(commentId: string, text: string, author: string) {
        try {

            const comment = await Comment.findById(commentId);
            if (!comment) {
                throw new Error('Comment not found');
            }
            const replyData = { text, author };

            comment.replies.push(replyData);
            await comment.save();

            return "comment successful";
        } catch (error) {
            console.error('Error adding reply : ', error);
            throw error;
        }
    };
    public async deleteComment(commentId: string, author: string) {
        try {
            const comment = await Comment.findById(commentId);
            if (!comment) {
                throw new Error('Comment not found');
            }
            if (comment.author !== author) {
                throw new Error('You are not the author of the comment');
            }

            comment.isDeleted = true;
            await comment.save();

            return "Comment removed successfully";
        } catch (error) {
            console.error('Error deleting comment:', error);
            throw error;
        }
    };
    public async getPosts(currentUserEmail: string, userEmails: string[]): Promise<any> {
        try {
            const posts = await Post.find({ creatorEmail: { $in: userEmails } })
                .sort({ createdAt: -1 })
                .exec();

            const postsWithIsLiked = posts.map((post) => ({
                ...post.toObject(),
                isLiked: post.likes.includes(currentUserEmail)
            }));

            return postsWithIsLiked;
        } catch (error) {
            console.error('Error retrieving posts:', error);
            throw error;
        }
    }
    public async deleteReply(commentId: string, replyId: string, author: string) {
        try {
            const objectId = new mongoose.Types.ObjectId(commentId);
            const replyObjectId = new mongoose.Types.ObjectId(replyId);

            const comment = await Comment.findById(objectId);
            if (!comment) {
                throw new Error('Comment not found');
            }

            // Find the reply by its ObjectId within the comment's replies array
            const replyIndex = comment.replies.findIndex(reply => reply._id?.equals(replyObjectId));
            if (replyIndex === -1) {
                throw new Error('Reply not found');
            }

            // Check if the author matches
            if (comment.replies[replyIndex].author !== author) {
                throw new Error('You are not the author of the reply');
            }

            comment.replies[replyIndex].isDeleted = true;

            await comment.save();

            return "Reply deleted successfully";
        } catch (error) {
            console.error('Error deleting reply:', error);
            throw error;
        }
    };
}