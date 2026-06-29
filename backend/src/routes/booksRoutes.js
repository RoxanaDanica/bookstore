import express from 'express';
import { retriveBooks, retriveBook, deleteBook, addBook, editBook } from '../services/booksService.js';
import { validateBookPayload } from '../validators/bookValidators.js';

const booksRouter = express.Router();

booksRouter.get("/", async (req, res) => {
  try {
    const page = Number(req.query.page) || 0;
    const limit = Number(req.query.limit) || 20;

    const filters = {
      search: req.query.search || "",
      genre: req.query.genre || "",
      author: req.query.author || "",
      minPrice: req.query.minPrice || null,
      maxPrice: req.query.maxPrice || null,
    };

    const offset = page * limit;

    const books = await retriveBooks(limit, offset, filters);

    res.status(200).json(books);
  } catch (err) {
    console.log("BACKEND ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

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

booksRouter.get('/search', async (req, res) => {
    const { title } = req.query;

    const books = await retriveBooks();

    const result = books.filter(book =>
        book.title.toLowerCase().includes(title.toLowerCase())
    );

    res.send(result);
});

booksRouter.get('/stock/:id', async (req, res) => {
    const { id } = req.params;

    const book = await retriveBook(id);

    if (!book || book.length === 0) {
        return res.send({ stock: 0 });
    }

    res.send({
        stock: book[0].stock || 0
    });
});


 
export default booksRouter; 