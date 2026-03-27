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
  findByEmail(email: string): User | null {
    const normalizedEmail = email.trim().toLowerCase();
    const users = usersTable.getAll();
    return users.find((item) => item.email.toLowerCase() === normalizedEmail) || null;
  }

  createUser(email: string, passwordHash: string): User {
    return usersTable.create({
      email: email.trim().toLowerCase(),
      password: passwordHash
    });
  }

  getById(id: number): User | null {
    return usersTable.getById(id);
  }
}

export default new AuthRepository();