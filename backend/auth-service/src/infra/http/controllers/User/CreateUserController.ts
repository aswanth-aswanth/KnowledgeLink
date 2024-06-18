import { Request, Response } from 'express';
import CreateUser from '../../../../app/useCases/User/implementations/CreateUser';
import UserRepository from '../../../../app/repositories/UserRepository';
import PasswordHasher from '../../../../app/providers/PasswordHasher';

export default class CreateUserController {
  public async handle(req: Request, res: Response): Promise<Response> {
    const { email, password, username } = req.body;

    const createUser = new CreateUser(
      new UserRepository(),
      new PasswordHasher()
    );

    try {
      const user = await createUser.execute(email, password, username);
      return res.status(201).json(user);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ error: err.message });
      }
      return res.status(400).json({ error: "Unknown error" });
    }
  }
}
