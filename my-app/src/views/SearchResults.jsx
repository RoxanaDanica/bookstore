import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import BackButton from "../components/BackButton";
import SidebarFilters from "../components/SidebarFilters";
import BookGrid from "../components/BookGrid";
import Pagination from "../components/Pagination";

import useBooks from "../hooks/useBooks";

import {
  getFilterGenres,
  getAuthors,
} from "../api/books";

export default function SearchResults() {
  const [searchParams] = useSearchParams();

  const searchQuery =
    searchParams.get("q") || "";

  const [genres, setGenres] = useState([]);
  const [authors, setAuthors] = useState([]);

  const {
    books,
    filters,
    setFilters,
    page,
    setPage,
    totalPages,
    totalBooks,
    loading,
    } = useBooks({
    search: searchQuery,
  });

  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const [genresData, authorsData] =
          await Promise.all([
            getFilterGenres(),
            getAuthors(),
          ]);

        setGenres(
          Array.isArray(genresData)
            ? genresData
            : []
        );

        setAuthors(
          Array.isArray(authorsData)
            ? authorsData
            : []
        );
      } catch (error) {
        console.error(
          "Error loading filter options:",
          error
        );

        setGenres([]);
        setAuthors([]);
      }
    };

    loadFilterOptions();
  }, []);

  return (
    <main className="min-h-screen bg-[#f8f6f2] px-6 py-16">
      <div className="mx-auto max-w-[1400px]">
        <BackButton
          label="Back to books"
          className="mb-10"
        />

        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b5202d]">
          Search
        </p>

        <h1 className="mt-3 font-['Playfair'] text-[44px] font-semibold text-[#171717]">
          Results for “{searchQuery}”
        </h1>

        <p className="mt-3 text-sm text-[#817b75]">
          {totalBooks} books found
        </p>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[280px_1fr]">
          <aside className="h-fit rounded-2xl border border-[#e8e3dc] bg-[#faf8f5] p-5">
            <SidebarFilters
              genres={genres}
              authors={authors}
              filters={filters}
              setFilters={setFilters}
            />
          </aside>

          <section>
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
                  Try another title,
                  author, ISBN, or adjust
                  your filters.
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
                      onPageChange={
                        setPage
                      }
                    />
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}