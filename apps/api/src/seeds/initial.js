const dotenv = require('dotenv');
dotenv.config();

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number.parseInt(process.env.DB_PORT),
};

const { Client } = require('pg');

const client = new Client(config);

const run = async () => {
  await client.connect();

  await client.query(
    `insert into accounts (friendly_name, subdomain,description) values ($1,$2,$3)`,
    ['DevPleno', 'devpleno', 'Test account 1'],
  );
  await client.query(
    `insert into accounts (friendly_name, subdomain,description) values ($1,$2,$3)`,
    ['Subdomain', 'subdomain', 'Test account 2'],
  );

  await client.end();
};
run();
