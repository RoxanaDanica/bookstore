import SidebarFilters from "../components/SidebarFilters";
import BookGrid from "../components/BookGrid";
import useBooks from "../components/useBooks";
import useInfiniteScroll from "../components/useInfiniteScroll";

function Home() {
  const {
    books,
    setBooks,
    loadBooks,
    hasMore,
    filters,
    setFilters,
    searchTerm,
  } = useBooks();

  useInfiniteScroll(loadBooks, hasMore);

  return (
    <div className="flex flex-col items-center">
      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", width: "1400px" }}>

        <SidebarFilters
          books={books}
          filters={filters}
          setFilters={setFilters}
        />

        <BookGrid books={books} />
      </div>
    </div>
  );
}

export default Home;