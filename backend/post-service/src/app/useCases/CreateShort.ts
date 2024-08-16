// src/app/useCases/CreateShort.ts

import { IShort } from '../../infra/databases/mongoose/models/Short';
import ShortRepository from '../repositories/ShortRepository';
import { File } from 'formidable';
import { getVideoDurationInSeconds } from 'get-video-duration';

export default class CreateShort {
    private shortRepository: ShortRepository;

    constructor(shortRepository: ShortRepository) {
        this.shortRepository = shortRepository;
    }

    public async execute(short: IShort, file: File): Promise<IShort> {
        // Validate video duration
        const duration = await this.getVideoDuration(file.filepath);
        if (duration > 60) {
            throw new Error('Video duration must not exceed 60 seconds');
        }

        return await this.shortRepository.create(short, file);
    }

    private async getVideoDuration(filePath: string): Promise<number> {
        try {
            const duration = await getVideoDurationInSeconds(filePath);
            return duration;
        } catch (error) {
            throw new Error('Failed to get video duration');
        }
    }
}
