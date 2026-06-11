import Grid from "@mui/joy/Grid";
import BookCard from "./BookCard";

export default function BookGrid({ books }) {
  return (
    <Grid sx={{
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 2
    }}>
      {books.map(b => (
        <BookCard key={b.id} item={b} />
      ))}
    </Grid>
  );
}