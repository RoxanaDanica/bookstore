import fs from 'fs';
import csv from 'csv-parser';
import { initializeDatabase, retrieveConnection } from './src/persistance/db.js';

async function importBooks() {
    try {
        await initializeDatabase();
        const db = retrieveConnection();

        const books = [];

        fs.createReadStream('./data/books.csv')
            .pipe(csv())
            .on('data', (row) => {
                books.push(row);
            })
            .on('end', async () => {
                console.log(`Loaded ${books.length} books`);

                for (const book of books) {
                    try {
                        await db.execute(
                            `INSERT INTO books 
                            (isbn13, isbn10, title, subtitle, authors, categories, thumbnail, description, published_year, average_rating, num_pages, ratings_count)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                            [
                                book.isbn13 || null,
                                book.isbn10 || null,
                                safeString(book.title, 1000),
                                safeString(book.subtitle),
                                book.authors || null,
                                book.categories || null,
                                book.thumbnail || null,
                                book.description || null,
                                cleanNumber(book.published_year),
                                cleanNumber(book.average_rating),
                                cleanNumber(book.num_pages),
                                cleanNumber(book.ratings_count)
                            ]
                        );
                    } catch (err) {
                        console.error('Insert error:', err.message);
                    }
                }

                console.log('Import finished!');
                process.exit(0);
            });

    } catch (err) {
        console.error('DB error:', err.message);
    }
}

function cleanNumber(value) {
    if (!value || value.trim() === '') return null;
    const num = Number(value);
    return isNaN(num) ? null : num;
}

function safeString(value, maxLength = null) {
    if (!value || value.trim() === '') return null;
    if (maxLength) return value.slice(0, maxLength);
    return value;
}

importBooks();