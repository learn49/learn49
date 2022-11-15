module.exports = {
  type: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  synchronize: false,
  logging: true,
  migrations: ['src/migrations/**.ts'],
  ssl: true,
  extra: {
    ssl: {
      rejectUnauthorized: false
    }
  }
};
