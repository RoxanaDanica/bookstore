import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BackButton from "../components/BackButton";
import BookGrid from "../components/BookGrid";
import Pagination from "../components/Pagination";

import {
  getBooks,
  getTopRatedBooks,
} from "../api/books";

export default function BookCollection({ type }) {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const [loading, setLoading] = useState(false);

  const { category } = useParams();

  const limit = 20;

  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoading(true);

        let result;

        if (type === "featured") {
            result = await getTopRatedBooks(
                limit,
                page
            );
            } else {
            const response = await getBooks(
                limit,
                page,
                {
                genre: category ? [category] : [],
                author: [],
                search: "",
                minPrice: "",
                maxPrice: "",
                }
            );

            result = response.data;
        }

        setBooks(result.books);
        setTotalPages(result.totalPages);
        setTotalBooks(result.total);
      } catch (error) {
        console.error(
          "Error loading collection:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, [category, page, type]);

  useEffect(() => {
    setPage(1);
  }, [category, type]);

  const title =
    type === "featured"
      ? "Featured Books"
      : category;

  return (
    <main className="min-h-screen bg-[#f8f6f2] px-6 py-16">
      <div className="mx-auto max-w-[1400px]">
        <BackButton className="mb-10" />
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b5202d]">
          Ivory & Ink
        </p>

        <h1 className="mt-3 font-['Playfair'] text-[44px] font-semibold text-[#171717]">
          {title}
        </h1>

        <div className="mt-3 flex items-center justify-between">
          <p className="text-sm text-[#817b75]">
            {totalBooks} books
          </p>

          {totalPages > 1 && (
            <p className="text-sm text-[#817b75]">
              Page {page} of {totalPages}
            </p>
          )}
        </div>

        <div className="mt-12">
          {loading ? (
            <div className="py-20 text-center text-sm text-[#817b75]">
              Loading books...
            </div>
          ) : books.length === 0 ? (
            <div className="py-20 text-center">
              <h2 className="font-['Playfair'] text-2xl text-[#171717]">
                No books found
              </h2>

              <p className="mt-2 text-sm text-[#817b75]">
                There are currently no books in this collection.
              </p>
            </div>
          ) : (
            <>
              <BookGrid books={books} />

              {totalPages > 1 && (
                <div className="mt-16">
                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}