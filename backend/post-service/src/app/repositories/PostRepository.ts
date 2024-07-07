// src/app/repositories/PostRepository.ts

import Post, { IPost } from '../../infra/databases/mongoose/models/Post';
import S3Service from '../../infra/services/S3Service';
import { File } from 'formidable';


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


}