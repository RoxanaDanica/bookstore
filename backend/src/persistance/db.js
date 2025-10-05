import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

let connection = null;

export async function initializeDatabase() {
    if(connection) {
        throw new Error('Database already initialized!');
    }
    connection = await mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password : process.env.PASSWORD,
    database: process.env.DATABASE,
    }); 
}

export const retrieveConnection = () => {
    if(connection) {
        return connection;
    } else {
        throw new Error('No databe connected!');
    }
}