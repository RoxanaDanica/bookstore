
import { retrieveConnection } from "./db.js";

const getInsertBookPreparedStatement = () => {
    const allFields = [
        'title',
        'author',
        'genre',
        'publisher',
        'publicationYear',
        'isbn',
        'language',
        'pages',
        'description',
        'coverImage',
        'rating',
        'availableCopies',
        'price'
    ];

    const fieldsWithTicks = allFields.map(
        field => `\`${field}\``
    );

    const placeholders = allFields
        .map(() => '?')
        .join(', ');

    return `
        INSERT INTO books (${fieldsWithTicks.join(', ')})
        VALUES (${placeholders})
    `;
};

export const createBooks = async (rows) => {
    const db = retrieveConnection();
    const sql = getInsertBookPreparedStatement();

    const results = await Promise.all(
        rows.map(row =>
            db.execute(sql, Object.values(row))
        )
    );

    return results;
};
