import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';
import { AppDataSource, initializeDatabase } from './dataSource';
import { NEWSPOST_GENRES, NewspostEntity, UserEntity } from './models';

const DEFAULT_USER_EMAIL = 'seed.user@example.com';
const DEFAULT_USER_PASSWORD = '123456';
const SEED_POSTS_COUNT = 20;

async function main(): Promise<void> {
  await initializeDatabase();

  const userRepository = AppDataSource.getRepository(UserEntity);
  const newspostRepository = AppDataSource.getRepository(NewspostEntity);

  const passwordHash = await bcrypt.hash(DEFAULT_USER_PASSWORD, 10);

  let user = await userRepository.findOne({
    where: {
      email: DEFAULT_USER_EMAIL
    }
  });

  if (!user) {
    user = await userRepository.save({
      email: DEFAULT_USER_EMAIL,
      password: passwordHash,
      deleted: false
    });
  } else {
    user.deleted = false;
    user.password = passwordHash;
    user = await userRepository.save(user);
  }

  const existingSeedPosts = await newspostRepository.count({
    where: {
      author: {
        id: user.id
      },
      deleted: false
    }
  });

  if (existingSeedPosts < SEED_POSTS_COUNT) {
    const postsToInsert = Array.from({ length: SEED_POSTS_COUNT - existingSeedPosts }, (_, index) => {
      const seedNumber = existingSeedPosts + index + 1;
      const genre = faker.helpers.arrayElement([...NEWSPOST_GENRES]);

      return newspostRepository.create({
        title: `Seed news #${seedNumber}: ${faker.lorem.sentence(3)}`,
        text: faker.lorem.paragraphs({ min: 1, max: 2 }),
        genre,
        isPrivate: faker.datatype.boolean(),
        deleted: false,
        author: user
      });
    });

    await newspostRepository.save(postsToInsert);
  }

  console.log(`Seed completed. User: ${DEFAULT_USER_EMAIL}, password: ${DEFAULT_USER_PASSWORD}, posts: ${SEED_POSTS_COUNT}`);

  await AppDataSource.destroy();
}

main().catch(async (error) => {
  console.error('Seed failed:', error);

  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }

  process.exit(1);
});
