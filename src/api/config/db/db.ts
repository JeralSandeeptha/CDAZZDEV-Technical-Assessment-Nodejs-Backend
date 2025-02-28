import dotenv from 'dotenv';
import { Pool } from 'pg';
import logger from '../logger/logger';

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// test the database connection
const testConnection = async () => {
    try {
        await pool.connect();
        logger.info('Database connection established successfully');
    } catch (error) {
        logger.error('Database connection failed');
        logger.error(error);
    }
};

// test the connection
testConnection();

export default pool;