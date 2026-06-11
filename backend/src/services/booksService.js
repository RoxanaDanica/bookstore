import { getBooks, getBook, removeBook, createBook, modifiedBook } from "../persistance/books.js";

export const retriveBooks = async (limit, offset, filters) => {
  const safeLimit = Number(limit) || 20;
  const safeOffset = Number(offset) || 0;

  return getBooks(safeLimit, safeOffset, filters);
};

export const retriveBook = async(id) => {
    const book = await getBook(id);
    return book;
}

export const deleteBook = async(id) => {
    const book = await removeBook(id);
    return book;
}

export const addBook = async(book) => {
    const newBook = await createBook(book);
    return newBook;
}

export const editBook = async(id, modifyBook) => {
    const updatedBook = await modifiedBook(id, modifyBook);
    return updatedBook;
}