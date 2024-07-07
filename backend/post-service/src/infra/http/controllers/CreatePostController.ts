// src/infra/http/controllers/CreatePostController.ts

import { Request, Response } from 'express';
import formidable from 'formidable';
import CreatePost from '../../../app/useCases/CreatePost';
import PostRepository from '../../../app/repositories/PostRepository';
import { File } from 'formidable';

export default class CreatePostController {
    public async handle(req: Request, res: Response): Promise<Response> {
        const form = formidable({ multiples: true });

        return new Promise((resolve) => {
            form.parse(req, async (err, fields, files) => {
                if (err) {
                    console.error(err);
                    return resolve(res.status(500).json({ error: 'Error parsing form data' }));
                }

                const createPost = new CreatePost(new PostRepository());
                const creatorEmail = (req as any).user.email;

                const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
                const description = Array.isArray(fields.description) ? fields.description[0] : fields.description;
                const tags = Array.isArray(fields.tags) ? fields.tags : fields.tags ? [fields.tags] : undefined;

                const post = {
                    title,
                    description,
                    tags,
                    creatorEmail,
                };

                // Filter out undefined values and ensure all elements are Files
                const fileArray: File[] = Object.values(files)
                    .flat()
                    .filter((file): file is File => file !== undefined);

                try {
                    const result = await createPost.execute(post as any, fileArray);
                    return resolve(res.status(201).json(result));
                } catch (err) {
                    if (err instanceof Error) {
                        console.error(`Error creating post: ${err.message}`);
                        return resolve(res.status(400).json({ error: err.message }));
                    }
                    return resolve(res.status(400).json({ error: "Unknown error" }));
                }
            });
        });
    }
}