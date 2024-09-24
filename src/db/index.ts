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
interface Users {
  id: number;
  username: string;
  email: string;
  password: string;
  role: 'user' | 'moderator' | 'admin';
  created_at: Date;
}

interface Posts {
  id: number;
  title: string;
  content: string;
  user_id: number;
  created_at: Date;
}

interface Comments {
  id: number;
  content: string;
  post_id: number;
  user_id: number;
  created_at: Date;
}

interface Groups {
  id: number;
  name: string;
  description?: string;
  created_at: Date;
}

interface UserGroups {
  user_id: number;
  group_id: number;
}

interface Reactions {
  id: number;
  post_id: number;
  user_id: number;
  type: 'like' | 'dislike';
  created_at: Date;
}

interface Database {
  users: Users;
  posts: Posts;
  comments: Comments;
  groups: Groups;
  user_groups: UserGroups;
  reactions: Reactions;
}
export default db;
