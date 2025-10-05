import { getBooks } from "../persistance/books.js";

export const retriveBooks = async() => {
    const books = await getBooks();
    return books;
}