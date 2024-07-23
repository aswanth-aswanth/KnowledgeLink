import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from 'uuid';
import { createReadStream } from 'fs';
import { File } from 'formidable';
import path from 'path';

export default class S3Service {
    private s3Client: S3Client;

    constructor() {
        this.s3Client = new S3Client({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
            }
        });
    }

    async uploadFile(file: File, folder: string): Promise<string> {
        const fileExtension = path.extname(file.originalFilename || '');
        const fileName = `${folder}/${uuidv4()}${fileExtension}`;

        const fileStream = createReadStream(file.filepath);

        const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: fileName,
            Body: fileStream,
            ContentType: file.mimetype || 'application/octet-stream'

        };

        await this.s3Client.send(new PutObjectCommand(params));

        return `https://s3.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_S3_BUCKET_NAME}/${fileName}`;

    }
}