
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'node:fs';

dotenv.config();

let pool = null;

export async function initializeDatabase() {
    if (pool) {
        throw new Error('Database already initialized!');
    }

    const useSSL = process.env.DB_SSL === 'true';

    const dbConfig = {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT || 3306),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,

        waitForConnections: true,
        connectionLimit: 5,
        maxIdle: 2,
        idleTimeout: 30000,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0,
    };

    if (useSSL) {
        dbConfig.ssl = {
            minVersion: 'TLSv1.2',
            rejectUnauthorized: true,
        };

        if (process.env.DB_SSL_CA_PATH) {
            dbConfig.ssl.ca = fs.readFileSync(
                process.env.DB_SSL_CA_PATH,
                'utf8'
            );
        }
    }

    const newPool = mysql.createPool(dbConfig);

    try {
        await newPool.query('SELECT 1');

        pool = newPool;

        console.log('Database pool connected successfully!');
    } catch (error) {
        await newPool.end();
        console.error('Database connection failed:', error.message);
        throw error;
    }
}

export const retrieveConnection = () => {
    if (!pool) {
        throw new Error('Database pool not initialized!');
    }

    return pool;
};
