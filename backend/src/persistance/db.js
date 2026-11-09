
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'node:fs';

dotenv.config();

let connection = null;

export async function initializeDatabase() {
    if (connection) {
        throw new Error('Database already initialized!');
    }

    const useSSL = process.env.DB_SSL === 'true';

    const dbConfig = {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT || 3306),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    };

    if (useSSL) {
        dbConfig.ssl = {
            minVersion: 'TLSv1.2',
            rejectUnauthorized: true,
        };

        // Optional: explicit CA certificate for TiDB Cloud.
        // If DB_SSL_CA_PATH is not set, Node.js uses its trusted CAs.
        if (process.env.DB_SSL_CA_PATH) {
            dbConfig.ssl.ca = fs.readFileSync(
                process.env.DB_SSL_CA_PATH,
                'utf8'
            );
        }
    }

    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Database connected successfully!');
    } catch (error) {
        console.error('Database connection failed:', error.message);
        throw error;
    }
}

export const retrieveConnection = () => {
    if (!connection) {
        throw new Error('No database connected!');
    }

    return connection;
};
