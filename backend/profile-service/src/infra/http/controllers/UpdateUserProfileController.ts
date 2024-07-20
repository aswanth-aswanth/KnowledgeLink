// src/infra/http/controllers/UpdateUserProfileController.ts
import { Request, Response } from 'express';
import UpdateUserProfile from '../../../app/useCases/Profile/UpdateUserProfile';
import UserRepository from '../../../app/repositories/UserRepository';

export default class UpdateUserProfileController {
  public async handle(req: Request, res: Response): Promise<Response> {
    const { name, bio } = req.body;
    const userId = (req as any).user.userId; // Assuming user ID is added to the request object by authMiddleware

    const updateUserProfile = new UpdateUserProfile(new UserRepository());

    try {
      const user = await updateUserProfile.execute({
        userId,
        name,
        bio,
        imageFile: req.file,
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.status(200).json(user);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ error: err.message });
      }
      return res.status(400).json({ error: 'Unknown error' });
    }
  }
}
