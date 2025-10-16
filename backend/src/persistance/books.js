import { retrieveConnection } from "./db.js";

export const getBooks = async() => {
    const [books] = await retrieveConnection().execute(`SELECT * FROM books`);
    return books;
}

export const getBook = async(id) => {
    const [book] = await retrieveConnection().execute('SELECT * FROM `books` WHERE `id` = ?',  [id]);
    return book;
} 

export const removeBook = async(id) => {
    const [book] = await retrieveConnection().execute('DELETE FROM books WHERE `id` = ?', [id]);
    return book;
}

export const createBook = async(book) => {
    const { id,title, author,  genre, publisher, publicationYear, isbn, language, pages, description, coverImage, rating, availableCopies, price } = book;
    const [newBook] = await retrieveConnection().execute('INSERT INTO books(`id`,`title`,`author`,`genre`,`publisher`,`publicationYear`,`isbn`,`language`,`pages`,`description`,`coverImage`,`rating`,`availableCopies`,`price`) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [id, title, author, genre, publisher, publicationYear, isbn, language, pages, description, coverImage, rating, availableCopies, price]);
    return newBook;
}  

export const modifiedBook = async(id, modifyBook) => {
    const { title, author,  genre, publisher, publicationYear, isbn, language, pages, description, coverImage, rating, availableCopies, price } = modifyBook;
    const result = await retrieveConnection().execute('UPDATE books SET `title`=?, `author`=?, `genre`=?, `publisher`=?, `publicationYear`=?, `isbn`=?, `language`=?, `pages`=?, `description`=?, `coverImage`=?, `rating`=?, `availableCopies`=?, `price`=? WHERE `id`=?', [title, author, genre, publisher, publicationYear, isbn, language, pages, description, coverImage, rating, availableCopies, price, id]);
    return result;
} 
 