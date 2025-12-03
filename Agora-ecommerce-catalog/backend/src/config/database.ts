import mysql from 'mysql2/promise';
import { env } from './env';

// Create connection pool with SSL support for PlanetScale/cloud databases
export const pool = mysql.createPool({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  database: env.db.name,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  // Enable SSL for cloud database connections (required for PlanetScale)
  ssl: env.isProduction ? { rejectUnauthorized: true } : undefined,
});

// Test database connection
export const testConnection = async (): Promise<boolean> => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
};

// Execute query helper
export const query = async <T>(sql: string, params?: unknown[]): Promise<T> => {
  const [rows] = await pool.query(sql, params);
  return rows as T;
};

// Transaction helper
export const transaction = async <T>(
  callback: (connection: mysql.PoolConnection) => Promise<T>
): Promise<T> => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export default pool;

