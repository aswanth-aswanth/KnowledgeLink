import { Request, Response } from 'express';
import formidable from 'formidable';
import CreateShort from '../../../app/useCases/CreateShort';
import ShortRepository from '../../../app/repositories/ShortRepository';
import { File } from 'formidable';

export default class CreateShortController {
    public async handle(req: Request, res: Response): Promise<Response> {
        const form = formidable({ maxFileSize: 100 * 1024 * 1024 }); // 100MB max file size

        return new Promise((resolve) => {
            form.parse(req, async (err, fields, files) => {
                if (err) {
                    console.error(err);
                    return resolve(res.status(500).json({ error: 'Error parsing form data' }));
                }

                const createShort = new CreateShort(new ShortRepository());
                const creatorId = (req as any).user.userId;

                const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
                const description = Array.isArray(fields.description) ? fields.description[0] : fields.description;
                const tags = Array.isArray(fields.tags) ? fields.tags : fields.tags ? [fields.tags] : undefined;

                const short = {
                    title,
                    description,
                    tags,
                    creatorId,
                };

                // Ensure files.video is not undefined and is a single File
                const videoFile = Array.isArray(files.video) ? files.video[0] : files.video;

                if (!videoFile || !(videoFile instanceof File)) {
                    return resolve(res.status(400).json({ error: 'No valid video file uploaded' }));
                }

                try {
                    const result = await createShort.execute(short as any, videoFile);
                    return resolve(res.status(201).json(result));
                } catch (err) {
                    if (err instanceof Error) {
                        console.error(`Error creating short: ${err.message}`);
                        return resolve(res.status(400).json({ error: err.message }));
                    }
                    return resolve(res.status(400).json({ error: "Unknown error" }));
                }
            });
        });
    }
}
