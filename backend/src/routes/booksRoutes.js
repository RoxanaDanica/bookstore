import express from "express";
import {
  retriveBooks,
  retriveBook,
  deleteBook,
  addBook,
  editBook,
  retriveBooksCategories,
  retriveTopRatedBooks,
  searchBooks,
  retriveGenres,
  retriveAuthors,
} from "../services/booksService.js";

const booksRouter = express.Router();

booksRouter.get("/", async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.max(Number(req.query.limit) || 20, 1);

    const offset = (page - 1) * limit;
    console.log("REQ QUERY:", req.query);

    const result = await retriveBooks(
      limit,
      offset,
      {
        search: req.query.search,
        genre: req.query.genre,
        author: req.query.author,
        minPrice: req.query.minPrice,
        maxPrice: req.query.maxPrice,
      }
    );

    res.status(200).json({
      books: result.books,
      page,
      limit,
      total: result.total,
      totalPages: Math.ceil(result.total / limit),
    });
  } catch (err) {
    console.log("BACKEND ERROR:", err);

    res.status(500).json({
      error: err.message,
    });
  }
});

booksRouter.get("/search", async (req, res) => {
  try {
    const { title } = req.query;

    if (!title) {
      return res.status(400).json({
        error: "title is required"
      });
    }

    const books = await searchBooks(title);

    res.status(200).json(books);
  } catch (err) {
    console.log("SEARCH ERROR:", err);

    res.status(500).json({
      error: err.message
    });
  }
});

booksRouter.get("/genres", async (req, res) => {
  try {
    const genres = await retriveGenres();

    res.status(200).json(genres);
  } catch (err) {
    console.log("GENRES ERROR:", err);

    res.status(500).json({
      error: err.message,
    });
  }
});

booksRouter.get("/authors", async (req, res) => {
  try {
    const authors = await retriveAuthors();

    res.status(200).json(authors);
  } catch (err) {
    console.log("AUTHORS ERROR:", err);

    res.status(500).json({
      error: err.message,
    });
  }
});


booksRouter.get("/categories", async (req, res) => {
  const bookCategories =
    await retriveBooksCategories();

  res.send(bookCategories);
});

booksRouter.get("/top-rated", async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 20;
    const page = Number(req.query.page) || 1;

    const result = await retriveTopRatedBooks(
      limit,
      page
    );

    res.json(result);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Could not get top rated books",
    });
  }
});

booksRouter.get("/:id", async (req, res) => {
  const { id } = req.params;

  const book = await retriveBook(id);

  res.send(book[0]);
});

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