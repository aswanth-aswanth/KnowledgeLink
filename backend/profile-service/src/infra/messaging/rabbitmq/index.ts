import Consumer from './Consumer';
import CreateProfile from '../../../app/useCases/Profile/CreateProfile';
import UserRepository from '../../../app/repositories/UserRepository';

(async () => {
    const consumer = await Consumer.getInstance();
    const userRepository = new UserRepository();
    const createProfile = new CreateProfile(userRepository);
    consumer.consume('user.registration', async (msg) => {
        if (msg) {
            const userData = JSON.parse(msg.content.toString());
            await createProfile.execute(userData);
        }
    });
})();
