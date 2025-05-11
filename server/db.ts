import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { Pool } from 'mysql2/promise';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the root directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Debug: Log all environment variables (be careful with this in production)
console.log('Environment variables:', {
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_NAME: process.env.DB_NAME,
  DB_PASSWORD: process.env.DB_PASSWORD ? '****' : undefined
});

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'cs425',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Log database configuration (without sensitive data)
console.log('Database configuration:', {
  ...dbConfig,
  password: dbConfig.password ? '****' : undefined
});

export const dbPool: Pool = mysql.createPool(dbConfig);

// Test the database connection
export const testConnection = async () => {
  let connection;
  try {
    connection = await dbPool.getConnection();
    console.log('Database connected successfully');
    return true;
  } catch (err) {
    console.error('Error connecting to the database:', {
      message: err instanceof Error ? err.message : 'Unknown error',
      code: err instanceof Error ? (err as any).code : 'UNKNOWN',
      errno: err instanceof Error ? (err as any).errno : 'UNKNOWN',
      sqlState: err instanceof Error ? (err as any).sqlState : 'UNKNOWN',
      sqlMessage: err instanceof Error ? (err as any).sqlMessage : 'UNKNOWN',
      stack: err instanceof Error ? err.stack : 'No stack trace'
    });
    throw err;
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

export const JWT_SECRET = process.env.JWT_SECRET || 'mysecretkey123'; 