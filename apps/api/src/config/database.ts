import '../bootstrap';

export default {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  pass: process.env.DB_PASSWORD,
  db: process.env.DB_NAME,
  port: process.env.DB_PORT,
  //ssl: Boolean(process.env.DB_SSL || false)
};
