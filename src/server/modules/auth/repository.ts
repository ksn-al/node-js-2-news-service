import { getTable, registerSchema } from '../../../fileDB';
import { User } from '../../../fileDB/types';

const userSchema = {
  id: Number,
  email: String,
  password: String
};

registerSchema('users', userSchema);

const usersTable = getTable<User>('users');

class AuthRepository {
  async findByEmail(email: string): Promise<User | null> {
    const normalizedEmail = email.trim().toLowerCase();
    const users = usersTable.getAll();
    return users.find((item) => item.email.toLowerCase() === normalizedEmail) || null;
  }

  async createUser(email: string, passwordHash: string): Promise<User> {
    return usersTable.create({
      email: email.trim().toLowerCase(),
      password: passwordHash
    });
  }

  async getById(id: number): Promise<User | null> {
    return usersTable.getById(id);
  }
}

export default new AuthRepository();