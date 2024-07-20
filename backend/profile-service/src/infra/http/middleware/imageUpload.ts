import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../../utils/cloudinary';
import path from 'path';

const storage = (folderName: string) =>
  new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req: Express.Request, file: Express.Multer.File) => {
      return {
        folder: `roadmap/${folderName}`,
        public_id: `${file.originalname}-${Date.now()}`,
        format: path.extname(file.originalname).slice(1), // Extract the format from the file extension
        resource_type: 'image', // Specify the resource type
        allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'webp'],
      };
    },
  });

const uploadSingle = (folderName: string) =>
  multer({ storage: storage(folderName) }).single('image');

const uploadArray = (folderName: string) =>
  multer({ storage: storage(folderName) }).array('photos', 12);

export { uploadSingle, uploadArray };
