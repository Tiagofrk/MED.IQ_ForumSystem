import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';

const db = new Kysely({
  dialect: new PostgresDialect({
    pool: new Pool({
      database: 'MED.IQ_ForumSystem',
      host: 'localhost',
      user: 'postgres',
      password: 'root'
    })
  })
});

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  user_id: number;
}

interface Reaction {
  id: number;
  post_id: number;
  user_id: number;
  type: 'like' | 'dislike';
}

interface Database {
  users: User;
  posts: Post;
  reactions: Reaction;
}

export default db;
