import express from 'express';
import { retriveBooks, retriveBook, deleteBook, addBook, editBook } from '../services/booksService.js';
import { validateBookPayload } from '../validators/bookValidators.js';

const booksRouter = express.Router();

booksRouter.get('/', async(req, res) => {
    const books = await retriveBooks();
    res.send(books);
})

booksRouter.get('/:id', async (req, res) => {
    const { id } = req.params;
    const book = await retriveBook(id);
    res.send(book[0]);
})

booksRouter.delete('/:id', async(req,res) => {
    const { id } = req.params;
    const book = await deleteBook(id);
    res.send(book);
})

booksRouter.post('/', async(req, res) => {
    const book = req.body;
    try {
        validateBookPayload(book);
        const newBook = await addBook(book);
        res.send(200);
    } catch (error) {
        res.send(error.message);
    }
})

booksRouter.put('/:id', async(req, res)=> { 
    const id = req.params.id;
    const modifyBook = {...req.body};
    try {
        validateBookPayload(modifyBook);
        const book = await editBook(id, modifyBook);
        res.send(200);
    } catch (error) {
        res.send(error.message);
    }
})
 
export default booksRouter; 