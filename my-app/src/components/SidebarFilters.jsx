import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
} from "@mui/joy";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/joy/Checkbox";
import Slider from "@mui/material/Slider";

export default function SidebarFilters({ books = [], filters, setFilters }) {

  const uniqueGenres = [...new Set(books.map(b => b.categories))];
  const uniqueAuthors = [...new Set(books.map(b => b.authors))];

  const handleGenre = (genre) => {
    setFilters(prev => ({
      ...prev,
      genre: prev.genre.includes(genre)
        ? prev.genre.filter(g => g !== genre)
        : [...prev.genre, genre]
    }));
  };

  const handleAuthor = (author) => {
    setFilters(prev => ({
      ...prev,
      author: prev.author.includes(author)
        ? prev.author.filter(a => a !== author)
        : [...prev.author, author]
    }));
  };

  const handlePrice = (e, val) => {
    setFilters(prev => ({
      ...prev,
      price: val
    }));
  };

  return (
    <Box  sx={{ paddingLeft: '15px', paddingRight: '15px' }}>
      
      <Accordion defaultExpanded sx={{padding: '0 15px 0 0', margin: '20px 0 0 0', paddingBottom: "30px", borderBottom: '1px solid #e5e5e5', color: 'black'}} >
        <AccordionSummary                sx={{
                  outline: 'unset',
                  outlineWidth: '0',
                  fontSize: '18.8px',
                  fontWeight: 500,
                  fontFamily: '"Playfair Display", serif',
                  color: 'black',

                  '& button': {
                    color: 'black',
                  },

                  '& *': {
                    color: 'black',
                  },
                }}
        >Shop by Genre</AccordionSummary>
        <AccordionDetails>
          {uniqueGenres.map(g => (
            <FormControlLabel
              sx={{marginLeft: '0', display: 'flex', alignItems: 'flex-start', gap: 1}}
              key={g}
              control={
                <Checkbox
                  checked={filters.genre.includes(g)}
                  onChange={() => handleGenre(g)}
                />
              }
              label={g}
            />
          ))}
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded sx={{padding: '0 15px 0 0', margin: '20px 0 0 0', paddingBottom: "30px", borderBottom: '1px solid #e5e5e5', color: 'black'}} >
        <AccordionSummary                sx={{
                  outline: 'unset',
                  outlineWidth: '0',
                  fontSize: '18.8px',
                  fontWeight: 500,
                  fontFamily: '"Playfair Display", serif',
                  color: 'black',

                  '& button': {
                    color: 'black',
                  },

                  '& *': {
                    color: 'black',
                  },
                }}>Author</AccordionSummary>
        <AccordionDetails>
          {uniqueAuthors.map(a => (
            <FormControlLabel
              sx={{marginLeft: '0', display: 'flex', alignItems: 'flex-start', gap: 1}}
              key={a}
              control={
                <Checkbox
                  checked={filters.author.includes(a)}
                  onChange={() => handleAuthor(a)}
                />
              }
              label={a}
            />
          ))}
        </AccordionDetails>
      </Accordion>

      <Box sx={{ width: 200 }}>
        <h3>Price</h3>
        <Slider value={filters.price} onChange={handlePrice} />
      </Box>

    </Box>
  );
}