import pgtools from 'pgtools';

import { DB_HOST, DB_PASSWORD, DB_PORT, DB_USER, DB_NAME } from './env.config';

const config = {
  user: DB_USER,
  password: DB_PASSWORD,
  host: DB_HOST,
  port: DB_PORT,
};

const db_name = DB_NAME as string;

pgtools
  .createdb(config, db_name)
  .then(() => {
    console.log(`Database ${db_name} created successfully`);
  })
  .catch((error) => {
    if (error.name === 'duplicate_database') {
      console.log(`Database ${db_name} already exists`);
    } else {
      console.error(`Error creating database ${db_name}:`, error);
    }
  });
