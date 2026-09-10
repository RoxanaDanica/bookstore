import { getAxiosInstance } from "./axios";

const getBooks = (
  limit = 20,
  page = 1,
  filters = {},
  signal
) => {
  const params = new URLSearchParams();

  params.append("limit", limit);
  params.append("page", page);

  if (filters.search?.trim()) {
    params.append("search", filters.search.trim());
  }

  if (Array.isArray(filters.genre)) {
    filters.genre.forEach((genre) => {
      if (genre?.trim()) {
        params.append("genre", genre.trim());
      }
    });
  }

  if (Array.isArray(filters.author)) {
    filters.author.forEach((author) => {
      if (author?.trim()) {
        params.append("author", author.trim());
      }
    });
  }

  if (
    filters.minPrice !== "" &&
    filters.minPrice !== undefined &&
    filters.minPrice !== null
  ) {
    params.append("minPrice", filters.minPrice);
  }

  if (
    filters.maxPrice !== "" &&
    filters.maxPrice !== undefined &&
    filters.maxPrice !== null
  ) {
    params.append("maxPrice", filters.maxPrice);
  }

  return getAxiosInstance().get("/books", {
    params,
    signal,
  });
};

const getFilterGenres = async () => {
  const response = await getAxiosInstance().get("/books/genres");
  return response.data;
};

const getAuthors = async () => {
  const response = await getAxiosInstance().get("/books/authors");
  return response.data;
};

const getBook = async (id) => {
  const response = await getAxiosInstance().get(`/books/${id}`);
  return response.data;
};

const getBooksCategories = async () => {
  const response = await getAxiosInstance().get("/books/categories");
  return response.data;
};

const deleteBook = async (id) => {
  return getAxiosInstance().delete(`/books/${id}`);
};

const updateBook = async (id, book) => {
  return getAxiosInstance().put(`/books/${id}`, book);
};

const addBook = async (book) => {
  return getAxiosInstance().post("/books", book);
};

const getReviews = async (bookId) => {
  const response = await getAxiosInstance().get(`/reviews/${bookId}`);
  return response.data;
};

const addReview = async (review) => {
  const response = await getAxiosInstance().post("/reviews", review);
  return response.data;
};

const getTopRatedBooks = async (
  limit = 20,
  page = 1
) => {
  const response = await getAxiosInstance().get(
    "/books/top-rated",
    {
      params: {
        limit,
        page,
      },
    }
  );

  return response.data;
};

export {
  getBooks,
  getBook,
  deleteBook,
  updateBook,
  addBook,
  getReviews,
  addReview,
  getBooksCategories,
  getTopRatedBooks,
  getAuthors,
  getFilterGenres,
};