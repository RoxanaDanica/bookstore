import {
  getBooks,
  getBook,
  removeBook,
  createBook,
  modifiedBook,
  getBooksCategories,
  getTopRatedBooks,
  searchBooksByTitle,
  getAllGenres,
  getAllAuthors,
} from "../persistance/books.js";

export const retriveBook = async(id) => {
    const book = await getBook(id);
    return book;
}

export const retriveBooksCategories = async() => {
    const bookCategories = await getBooksCategories();
    return bookCategories;
}

export const retriveTopRatedBooks = async (
  limit = 20,
  page = 1
) => {
  return await getTopRatedBooks(limit, page);
};

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

export const searchBooks = async (title) => {
  if (!title) {
    return [];
  }

  return searchBooksByTitle(title);
};

export const retriveGenres = async () => {
  return getAllGenres();
};

export const retriveAuthors = async () => {
  return getAllAuthors();
};

const normalizeMultiFilter = (value) => {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter(Boolean);
  }

  return [String(value).trim()].filter(Boolean);
};

export const retriveBooks = async (
  limit,
  offset,
  filters = {}
) => {
  const safeLimit = Math.max(Number(limit) || 20, 1);
  const safeOffset = Math.max(Number(offset) || 0, 0);

  const normalizedFilters = {
    search: String(filters.search || "").trim(),

    genre: normalizeMultiFilter(filters.genre),

    author: normalizeMultiFilter(filters.author),

    minPrice:
      filters.minPrice !== undefined &&
      filters.minPrice !== null &&
      filters.minPrice !== ""
        ? Number(filters.minPrice)
        : null,

    maxPrice:
      filters.maxPrice !== undefined &&
      filters.maxPrice !== null &&
      filters.maxPrice !== ""
        ? Number(filters.maxPrice)
        : null,
  };

  return getBooks(
    safeLimit,
    safeOffset,
    normalizedFilters
  );
};