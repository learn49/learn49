import { getConnection, createConnection } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { sqlBaseInserts } from '../sql/base-sql';

createConnection({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'docker',
  database: 'learn49-test',
  logging: true,
});

const clearTables = async () => {
  const entities = [
    'extension_installations_webhooks',
    'label_enrollment',
    'enrollments',
    'users',
    'tokens',
    'accounts',
  ];

  for (const entity of entities) {
    const manager = getConnection();
    await manager.query(`delete from  "${entity}"`);
  }
};

const createBaseData = async () => {
  const manager = getConnection();
  for (const sqlBaseInsert of sqlBaseInserts) {
    await manager.query(sqlBaseInsert);
  }
};

async function create() {
  const connection = await createConnection();

  await clearTables();
  await createBaseData();
  await connection.close();
}

create();
