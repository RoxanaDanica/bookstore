import { retrieveConnection } from "./db.js";


export const getBooks = async (limit, offset, filters) => {
  let sql = `
    SELECT * FROM books
    WHERE 1=1
  `;

  const values = [];

  if (filters.search) {
    sql += ` AND title LIKE ?`;
    values.push(`%${filters.search}%`);
  }

  if (filters.genre) {
    sql += ` AND categories LIKE ?`;
    values.push(`%${filters.genre}%`);
  }

  if (filters.author) {
    sql += ` AND authors LIKE ?`;
    values.push(`%${filters.author}%`);
  }

  if (filters.minPrice !== null) {
    sql += ` AND price >= ?`;
    values.push(filters.minPrice);
  }

  if (filters.maxPrice !== null) {
    sql += ` AND price <= ?`;
    values.push(filters.maxPrice);
  }

  sql += `
    ORDER BY id ASC
    LIMIT ${limit}
    OFFSET ${offset}
  `;

  const [books] = await retrieveConnection().execute(sql, values);
  return books;
};

export const getBook = async(id) => {
    const [book] = await retrieveConnection().execute('SELECT * FROM `books` WHERE `id` = ?',  [id]);
    return book;
} 

export const removeBook = async(id) => {
    const [book] = await retrieveConnection().execute('DELETE FROM books WHERE `id` = ?', [id]);
    return book;
}

export const createBook = async(book) => {
    const { title, author,  genre, publisher, publicationYear, isbn, language, pages, description, coverImage, rating, availableCopies, price } = book;
    const [newBook] = await retrieveConnection().execute('INSERT INTO books(`title`,`author`,`genre`,`publisher`,`publicationYear`,`isbn`,`language`,`pages`,`description`,`coverImage`,`rating`,`availableCopies`,`price`) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)', [title, author, genre, publisher, publicationYear, isbn, language, pages, description, coverImage, rating, availableCopies, price]);
    return newBook;
}  

export const modifiedBook = async(id, modifyBook) => {
    const { title, author,  genre, publisher, publicationYear, isbn, language, pages, description, coverImage, rating, availableCopies, price } = modifyBook;
    const result = await retrieveConnection().execute('UPDATE books SET `title`=?, `author`=?, `genre`=?, `publisher`=?, `publicationYear`=?, `isbn`=?, `language`=?, `pages`=?, `description`=?, `coverImage`=?, `rating`=?, `availableCopies`=?, `price`=? WHERE `id`=?', [title, author, genre, publisher, publicationYear, isbn, language, pages, description, coverImage, rating, availableCopies, price, id]);
    return result;
} 
 