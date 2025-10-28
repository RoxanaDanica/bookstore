import { createBooks } from '../persistance/uploadFile.js';

export const addBooks = async(data) => {
    const newBook = await createBooks(data);
    console.log('data in service', data);
    return newBook; 
}