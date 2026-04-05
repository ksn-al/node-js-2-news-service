import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
  TableIndex
} from 'typeorm';

export class AddDeletedAndHeaderToPosts1712448000000 implements MigrationInterface {
  private async ensureIndex(queryRunner: QueryRunner, tableName: string, index: TableIndex): Promise<void> {
    const table = await queryRunner.getTable(tableName);
    const hasIndex = table?.indices.some((item) => item.name === index.name);

    if (!hasIndex) {
      await queryRunner.createIndex(tableName, index);
    }
  }

  private async dropIndexIfExists(queryRunner: QueryRunner, tableName: string, indexName: string): Promise<void> {
    const table = await queryRunner.getTable(tableName);
    const hasIndex = table?.indices.some((item) => item.name === indexName);

    if (hasIndex) {
      await queryRunner.dropIndex(tableName, indexName);
    }
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasUsersTable = await queryRunner.hasTable('users');

    if (!hasUsersTable) {
      await queryRunner.createTable(
        new Table({
          name: 'users',
          columns: [
            {
              name: 'id',
              type: 'serial',
              isPrimary: true
            },
            {
              name: 'email',
              type: 'varchar',
              isNullable: false,
              isUnique: true
            },
            {
              name: 'password',
              type: 'varchar',
              isNullable: false
            }
          ]
        })
      );
    }

    const hasNewspostsTable = await queryRunner.hasTable('newsposts');
    const hasPostsTable = await queryRunner.hasTable('posts');

    if (hasNewspostsTable && !hasPostsTable) {
      await queryRunner.renameTable('newsposts', 'posts');
    }

    if (!(await queryRunner.hasTable('posts'))) {
      await queryRunner.createTable(
        new Table({
          name: 'posts',
          columns: [
            {
              name: 'id',
              type: 'serial',
              isPrimary: true
            },
            {
              name: 'header',
              type: 'varchar',
              length: '50',
              isNullable: false
            },
            {
              name: 'text',
              type: 'text',
              isNullable: false
            },
            {
              name: 'genre',
              type: 'varchar',
              default: `'Other'`
            },
            {
              name: 'is_private',
              type: 'boolean',
              default: false
            },
            {
              name: 'create_date',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP'
            },
            {
              name: 'author_id',
              type: 'integer',
              isNullable: false
            }
          ]
        })
      );
    }

    if (await queryRunner.hasColumn('posts', 'title') && !(await queryRunner.hasColumn('posts', 'header'))) {
      await queryRunner.renameColumn('posts', 'title', 'header');
    }

    if (!(await queryRunner.hasColumn('users', 'deleted'))) {
      await queryRunner.addColumn(
        'users',
        new TableColumn({
          name: 'deleted',
          type: 'boolean',
          default: false,
          isNullable: false
        })
      );
    }

    if (!(await queryRunner.hasColumn('posts', 'deleted'))) {
      await queryRunner.addColumn(
        'posts',
        new TableColumn({
          name: 'deleted',
          type: 'boolean',
          default: false,
          isNullable: false
        })
      );
    }

    const postsTable = await queryRunner.getTable('posts');
    const hasAuthorForeignKey = postsTable?.foreignKeys.some((foreignKey) =>
      foreignKey.columnNames.includes('author_id')
    );

    if (!hasAuthorForeignKey) {
      await queryRunner.createForeignKey(
        'posts',
        new TableForeignKey({
          columnNames: ['author_id'],
          referencedTableName: 'users',
          referencedColumnNames: ['id'],
          onDelete: 'RESTRICT'
        })
      );
    }

    await this.ensureIndex(
      queryRunner,
      'users',
      new TableIndex({
        name: 'IDX_users_deleted',
        columnNames: ['deleted']
      })
    );

    await this.ensureIndex(
      queryRunner,
      'posts',
      new TableIndex({
        name: 'IDX_posts_author_id',
        columnNames: ['author_id']
      })
    );

    await this.ensureIndex(
      queryRunner,
      'posts',
      new TableIndex({
        name: 'IDX_posts_deleted',
        columnNames: ['deleted']
      })
    );

    await this.ensureIndex(
      queryRunner,
      'posts',
      new TableIndex({
        name: 'IDX_posts_create_date',
        columnNames: ['create_date']
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    if (await queryRunner.hasTable('posts')) {
      await this.dropIndexIfExists(queryRunner, 'posts', 'IDX_posts_create_date');
      await this.dropIndexIfExists(queryRunner, 'posts', 'IDX_posts_deleted');
      await this.dropIndexIfExists(queryRunner, 'posts', 'IDX_posts_author_id');

      if (await queryRunner.hasColumn('posts', 'deleted')) {
        await queryRunner.dropColumn('posts', 'deleted');
      }

      if (await queryRunner.hasColumn('posts', 'header') && !(await queryRunner.hasColumn('posts', 'title'))) {
        await queryRunner.renameColumn('posts', 'header', 'title');
      }
    }

    if (await queryRunner.hasTable('users')) {
      await this.dropIndexIfExists(queryRunner, 'users', 'IDX_users_deleted');

      if (await queryRunner.hasColumn('users', 'deleted')) {
        await queryRunner.dropColumn('users', 'deleted');
      }
    }

    if (await queryRunner.hasTable('posts') && !(await queryRunner.hasTable('newsposts'))) {
      await queryRunner.renameTable('posts', 'newsposts');
    }
  }
}
