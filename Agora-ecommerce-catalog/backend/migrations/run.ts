import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import { env } from '../src/config/env';

const runMigrations = async () => {
  console.log('Running database migrations...\n');

  // Create connection with multipleStatements enabled
  const connection = await mysql.createConnection({
    host: env.db.host,
    port: env.db.port,
    user: env.db.user,
    password: env.db.password,
    database: env.db.name,
    multipleStatements: true,
  });

  console.log('✅ Connected to database\n');

  try {
    // Read migration files
    const migrationsDir = path.join(__dirname);
    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();

    for (const file of files) {
      console.log(`Running migration: ${file}`);
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
      
      try {
        await connection.query(sql);
        console.log(`✅ ${file} completed\n`);
      } catch (error: any) {
        // Ignore duplicate key errors for INSERT ... ON DUPLICATE KEY
        if (!error.message.includes('Duplicate entry')) {
          console.error(`Error in ${file}:`, error.message);
          throw error;
        }
        console.log(`✅ ${file} completed (some data already exists)\n`);
      }
    }

    // Show created tables
    const [tables] = await connection.query('SHOW TABLES');
    console.log('Created tables:', (tables as any[]).map(t => Object.values(t)[0]).join(', '));
    console.log('\n✅ All migrations completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await connection.end();
  }
};

runMigrations();

