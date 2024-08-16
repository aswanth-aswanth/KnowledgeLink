import Short, { IShort } from '../../infra/databases/mongoose/models/Short';
import S3Service from '../../infra/services/S3Service';
import { File } from 'formidable';

export default class ShortRepository {
    private s3Service: S3Service;

    constructor() {
        this.s3Service = new S3Service();
    }

    public async create(short: IShort, file: File): Promise<IShort> {
        try {
            const uploadedUrl = await this.s3Service.uploadFile(file, 'shorts');

            const newShort = new Short({
                ...short,
                videoUrl: uploadedUrl,
            });

            await newShort.save();
            return newShort;
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Error creating short: ${error.message}`);
                throw new Error('Failed to create short');
            } else {
                console.error('Unknown error creating short');
                throw new Error('Unknown error');
            }
        }
    }

    public async getAll(): Promise<IShort[]> {
        return await Short.find().sort({ createdAt: -1 });
    }

    public async findById(id: string): Promise<IShort | null> {
        return await Short.findById(id);
    }

    public async incrementViews(id: string): Promise<void> {
        await Short.findByIdAndUpdate(id, { $inc: { views: 1 } });
    }

    public async addLike(shortId: string, userId: string): Promise<void> {
        await Short.findByIdAndUpdate(shortId, { $addToSet: { likes: userId } });
    }

    public async removeLike(shortId: string, userId: string): Promise<void> {
        await Short.findByIdAndUpdate(shortId, { $pull: { likes: userId } });
    }
}