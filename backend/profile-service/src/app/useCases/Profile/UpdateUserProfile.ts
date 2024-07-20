// src/app/useCases/Profile/UpdateUserProfile.ts
import UserRepository from '../../repositories/UserRepository';
import { IUser } from '../../../infra/databases/mongoose/models/User';
import cloudinary from '../../../infra/utils/cloudinary';

interface IUpdateUserProfileRequest {
  userId: string;
  name: string;
  bio: string;
  imageFile?: Express.Multer.File;
}

export default class UpdateUserProfile {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  public async execute({ userId, name, bio, imageFile }: IUpdateUserProfileRequest): Promise<IUser | null> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    let imageUrl = user.image;
    if (imageFile) {
      // Upload new image to Cloudinary
      const result = await cloudinary.uploader.upload(imageFile.path, {
        folder: 'roadmap/profile',
        public_id: `${imageFile.originalname}-${Date.now()}`,
      });

      // Delete old image from Cloudinary if exists
      if (user.image && user.image.startsWith('http')) {
        const publicId = user.image.split('/').slice(-1)[0].split('.')[0];
        await cloudinary.uploader.destroy(`roadmap/profile/${publicId}`);
      }

      imageUrl = result.secure_url;
    }

    user.username = name;
    user.bio = bio;
    user.image = imageUrl;

    return await this.userRepository.save(user);
  }
}
