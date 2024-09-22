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

export default db;
