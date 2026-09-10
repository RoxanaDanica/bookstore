import BookCard from "./BookCard";

export default function BookGrid({ books }) {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {books.map((book) => (
        <div key={book.id} className="min-w-0">
          <BookCard item={book} />
        </div>
      ))}
    </div>
  );
}