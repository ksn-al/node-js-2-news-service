import { EntitySchema } from 'typeorm';

export const NEWSPOST_GENRES = ['Politic', 'Business', 'Sport', 'Other'] as const;
export type NewspostGenre = (typeof NEWSPOST_GENRES)[number];

export interface DbUser {
  id: number;
  email: string;
  password: string;
  newsposts?: DbNewspost[];
}

export interface DbNewspost {
  id: number;
  title: string;
  text: string;
  genre: NewspostGenre;
  isPrivate: boolean;
  createDate: Date;
  author: DbUser;
}

export const UserEntity = new EntitySchema<DbUser>({
  name: 'User',
  tableName: 'users',
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true
    },
    email: {
      type: String,
      unique: true
    },
    password: {
      type: String
    }
  },
  relations: {
    newsposts: {
      type: 'one-to-many',
      target: 'Newspost',
      inverseSide: 'author'
    }
  }
});

export const NewspostEntity = new EntitySchema<DbNewspost>({
  name: 'Newspost',
  tableName: 'newsposts',
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true
    },
    title: {
      type: String,
      length: 50
    },
    text: {
      type: 'text'
    },
    genre: {
      type: String,
      default: 'Other'
    },
    isPrivate: {
      name: 'is_private',
      type: Boolean,
      default: false
    },
    createDate: {
      name: 'create_date',
      type: 'timestamp',
      createDate: true,
      default: () => 'CURRENT_TIMESTAMP'
    }
  },
  relations: {
    author: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: {
        name: 'author_id'
      },
      eager: true,
      nullable: false,
      onDelete: 'RESTRICT'
    }
  }
});
