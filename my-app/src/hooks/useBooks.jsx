import { useEffect, useState } from "react";
import { getBooks } from "../api/books";

const useBooks = () => {
  const [books, setBooks] = useState([]);

  const [filters, setFilters] = useState({
    search: "",
    genre: [],
    author: [],
    minPrice: "",
    maxPrice: "",
  });

  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const fetchBooks = async () => {
      try {
        setLoading(true);

        const response = await getBooks(
          limit,
          page,
          filters,
          controller.signal
        );

        setBooks(response.data.books);
        setTotalPages(response.data.totalPages);
        setTotalBooks(response.data.total);
      } catch (error) {
        if (error.code !== "ERR_CANCELED") {
          console.error("Error loading books:", error);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchBooks();

    return () => {
      controller.abort();
    };
  }, [page, limit, filters]);

  const changeFilters = (updater) => {
    setFilters((prev) => {
      if (typeof updater === "function") {
        return updater(prev);
      }

      return updater;
    });

    setPage(1);
  };

  return {
    books,
    filters,
    setFilters: changeFilters,
    page,
    setPage,
    totalPages,
    totalBooks,
    loading,
  };
};

export default useBooks;