import { retrieveConnection } from "./db.js";

const getInsertBookPreparedStatement = () => {
    const allFeilds = ['title', 'author', 'genre', 'publisher',
        'publicationYear', 'isbn', 'language', 'pages', 'description',
        'coverImage', 'rating', 'availableCopies', 'price'
    ];
    const fieldsWithTicks = allFeilds.map(field => '`' + field + '`');
    const sql = `INSERT INTO books(${fieldsWithTicks.join(', ')}) VALUES (${'?, '.repeat(allFeilds.length)})`;
    return sql.replace(/,\s*\)/, ')') ;
}  

export const createBooks = async(rows) => {
    const conn = await retrieveConnection();
    const promises = [];

    rows.forEach(row => {
        const promise = conn.execute(getInsertBookPreparedStatement(), Object.values(row));
        promises.push(promise);
    }); 
    const results = await Promise.all(promises);
    return results;

}  
