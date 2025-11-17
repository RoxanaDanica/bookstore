import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

let connection = null;

export async function initializeDatabase() {
    if(connection) {
        throw new Error('Database already initialized!');
    }
    connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    }); 
}

export const retrieveConnection = () => {
    if(connection) {
        return connection;
    } else {
        throw new Error('No databe connected!');
    }
}