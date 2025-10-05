import express from 'express';
import { retriveBooks } from '../services/booksService.js';

const booksRouter = express.Router();

booksRouter.get('/', async(req, res) => {
    const books = await retriveBooks();
    res.send(books);
})

export default booksRouter; 