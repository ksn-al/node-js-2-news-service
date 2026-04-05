import { AppDataSource } from '../../database/dataSource';
import { UserEntity } from '../../database/models';
import { UserRecord } from './types';

class AuthRepository {
  private get repository() {
    return AppDataSource.getRepository(UserEntity);
  }

  async findByEmail(email: string): Promise<UserRecord | null> {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await this.repository.findOne({ where: { email: normalizedEmail, deleted: false } });

    return user
      ? {
          id: user.id,
          email: user.email,
          password: user.password
        }
      : null;
  }

  async createUser(email: string, passwordHash: string): Promise<UserRecord> {
    const savedUser = await this.repository.save({
      email: email.trim().toLowerCase(),
      password: passwordHash,
      deleted: false
    });

    return {
      id: savedUser.id,
      email: savedUser.email,
      password: savedUser.password
    };
  }

  async getById(id: number): Promise<UserRecord | null> {
    const user = await this.repository.findOne({ where: { id, deleted: false } });

    return user
      ? {
          id: user.id,
          email: user.email,
          password: user.password
        }
      : null;
  }
}

export default new AuthRepository();