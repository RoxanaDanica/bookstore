import { retrieveConnection } from "./db.js";

export const getBooks = async() => {
    const [books] = await retrieveConnection().execute(`
    SELECT * FROM books`);
    return books;
}