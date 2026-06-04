import { useEffect, useState } from 'react';
import { getBooks } from '../api/books';
import { useCart } from "react-use-cart";
import { Link } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

import Grid from '@mui/joy/Grid';
import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardActions from '@mui/joy/CardActions';
import Typography from '@mui/joy/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/joy/Box';
import Checkbox from '@mui/joy/Checkbox';
import Slider from '@mui/material/Slider';
import Accordion from '@mui/joy/Accordion';
import AccordionDetails from '@mui/joy/AccordionDetails';
import AccordionSummary from '@mui/joy/AccordionSummary';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';
import Chat from './Chat';
import StarRateIcon from '@mui/icons-material/StarRate';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarHalfIcon from '@mui/icons-material/StarHalf';


function Home() {
  
  const [books, setBooks] = useState([]);
  const [value, setValue] = useState([0, 100]);
  const [addedMessage, setAddedMessage] = useState("");
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    authors: [],
    genres: [],
    price: {min:0, max: 100}
  });
  const { addItem } = useCart();

  const uniqueAuthors = [...new Set(books.map(book => book.author))];
  const uniqueGenres = [...new Set(books.map(b => b.genre))];
  const selectedGenre = searchParams.get("genre");
  const searchTerm = searchParams.get("search") || "";

  useEffect(() => {
    getBooks().then((response) => {
      setBooks(response.data);
    })
  }, []);

  function valuetext(value) {
    return `${value}$`;
  }
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleGenreChange = (genre) => {
    setFilters(prev => {
      const alreadySelected = prev.genres.includes(genre);
      return {
        ...prev,
        genres: alreadySelected ? prev.genres.filter(g => g !== genre) : [...prev.genres, genre],  
      };
    });
  };
  function handleAuthorChange(author) {
    setFilters(prev => {
      const alreadySelected = prev.authors.includes(author);
      return{
        ...prev,
        authors: alreadySelected ? prev.authors.filter(a => a !== author) : [...prev.authors, author]
      }
    })
  }
  function isFiltersEmpty() {
    return (
      filters.searchTerm === '' &&
      filters.authors.length === 0 &&
      filters.genres.length === 0 &&
      filters.price.min === 0 &&
      filters.price.max === 100
    );
  };

  
  function resetFilters() {
    setFilters({
      searchTerm: '',
      authors: [],
      genres: [],
      price: {min:0, max: 100}
    })
  }
  function renderStars(rating) {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(<StarRateIcon key={i} sx={{ color: 'black' }} />);
      } else if (rating >= i - 0.5) {
        stars.push(<StarHalfIcon key={i} sx={{ color: 'black' }} />);
      } else {
        stars.push(<StarBorderIcon key={i} sx={{ color: 'black' }} />);
      }
    }

    return stars;
  }
  const filteredBooks = books.filter(book => {
  const matchesAuthor =
    filters.authors.length === 0 ||
    filters.authors.includes(book.author);

  const matchesGenre =
    filters.genres.length === 0 ||
    filters.genres.includes(book.genre);

  const matchesPrice =
    book.price >= value[0] &&
    book.price <= value[1];

  const matchesSearch =
    searchTerm === "" ||
    book.title.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesHeaderGenre =
    !selectedGenre || book.genre === selectedGenre;

  return (
    matchesAuthor &&
    matchesGenre &&
    matchesPrice &&
    matchesSearch &&
    matchesHeaderGenre
  );
});

  return ( 
    <div className="flex flex-col items-center">
      <Box sx= {{display: 'grid', gridTemplateColumns: '300px 1fr', width: '1400px' }}> 
        <Box sx={{ paddingLeft: '15px', paddingRight: '15px' }}>
          {!isFiltersEmpty() ? (    <Button variant="outlined" onClick={resetFilters}>  Reset All Filters </Button>) : ('')}
          <Accordion defaultExpanded sx={{padding: '0 15px 0 0', margin: '20px 0 0 0', paddingBottom: "30px", borderBottom: '1px solid #e5e5e5', color: 'black'}} >
            <AccordionSummary disableGutters={true}
                sx={{
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
              {uniqueGenres.map(genre => (
                <FormControlLabel  sx={{marginLeft: '0', display: 'flex', gap: 1}}
                key={genre}
                control={ <Checkbox checked={filters.genres.includes(genre)} onChange={() => handleGenreChange(genre)} />}
                label={genre} />
              ))}
            </AccordionDetails>
          </Accordion>
          <Accordion defaultExpanded  sx={{padding: '0 15px 0 0', margin: '20px 0 0 0', paddingBottom: "30px", borderBottom: '1px solid #e5e5e5', color: 'black'}} >
            <AccordionSummary className="font-jost" disableGutters={true}
                sx={{
                  outline: 'unset',
                  outlineWidth: '0',
                  fontSize: '18.8px',
                  fontFamily: '"Playfair Display", serif',
                  fontWeight: 500,
                  color: 'black',

                  '& button': {
                    color: 'black',
                  },

                  '& *': {
                    color: 'black',
                  },
                }}
             >Author</AccordionSummary>
            <AccordionDetails>
              {uniqueAuthors.map(author => (
                <FormControlLabel sx={{marginLeft: '0', display: 'flex', gap: 1}}
                key={author}
                control={ <Checkbox checked={filters.authors.includes(author)} onChange={() => handleAuthorChange(author)} />}
                label={author} />
              ))}
            </AccordionDetails>
          </Accordion>
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '200px', gap: 1, textAlign: "start", fontFamily: '"Playfair Display", serif',  }}>
            <h3 className="text-[20px] font-medium font-[Playfair Display]">Price</h3>
            <Slider
              getAriaLabel={() => 'Price'}
              value={value}
              onChange={handleChange}
              valueLabelDisplay="auto"
              getAriaValueText={valuetext}
            />
          </Box>
        </Box>
        {filteredBooks.length > 0 ? (
          <div>
            <h2>Books</h2> 
            <Grid  sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
              {filteredBooks.map(item => 
                <Card
                  key={item.id}
                  orientation="vertical"
                  size="md"
                  variant="soft"
                  sx={{
                    bgcolor: 'transparent',
                    position: 'relative',
                    overflow: 'hidden',

                    '& .add-to-cart-btn': {
                      opacity: 0,
                      transform: 'translateY(-60px)',
                      transition: 'all 0.5s ease',
                    },

                    '&:hover .add-to-cart-btn': {
                      opacity: 1,
                      transform: 'translateY(0)',
                    },
                  }}
                >
                  <CardContent>
                    <AspectRatio
                      ratio={256 / 300}
                      sx={{
                        width: 256,
                        height: 300,
                        bgcolor: '#f7f7f7',
                      }}
                    >
                      <img
                        src={item.coverImage}
                        style={{
                          width: '100%',
                          paddingTop: '20px',
                          paddingBottom: '20px',
                          height: '100%',
                          objectFit: 'contain',
                        }}
                      />
                    </AspectRatio>
                    <Typography level="title-lg" sx= {{ fontFamily: '"Playfair Display", serif', display: 'flex', justifyContent: 'center', paddingTop: '20px', marginTop: '10px', marginBottom: '10px' }}>{item.title}</Typography>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px', marginTop: '10px' }}>
                      {renderStars(item.rating)}
                    </div>
                    <Typography level="title-lg" sx={{ marginTop: '10px', marginBottom: '10px', display: 'flex', justifyContent: 'center', color: '#e52334', fontSize: '18px', fontWeight: '500', fontFamily: '"Jost", serif' }}>{item.price} $</Typography>
                    {/* <Typography level="body-md">{item.description}</Typography> */}
                  </CardContent> 
                  <CardActions
                    sx={{
                      justifyContent: 'center',

                      '& > .MuiButton-root': {
                        flex: 'none !important',
                        width: 'auto !important',
                      },
                    }}

                  >
                    <Button
                      className="add-to-cart-btn"
                      variant="contained"
                      sx={{
                        padding: '15px 30px',
                        fontSize: '14px',
                        lineHeight: '20px',
                        backgroundColor: '#e52334',
                        color: '#ffffff',
                        fontFamily: '"Jost", sans-serif',
                        textTransform: 'uppercase',
                        verticalAlign: 'middle',
                        flex: 'none',
                        borderRadius: '0',
                        outline: 'none',
                        width: 'auto',
                        letterSpacing: '0.5px',
                      }}  
                      onClick={() => {
                        addItem(item);

                        setAddedMessage(`"${item.title}" has been added to the cart!`);

                        setTimeout(() => {
                          setAddedMessage("");
                        }, 1500);
                      }}
                    >
                      Add to Cart
                    </Button>
                  </CardActions>
                </Card>
            )}
            </Grid>       
          </div>
        ) : (
        <Grid sx={{ paddingLeft: '30px', textAlign: 'start' }}>
          <Typography level="body-lg" sx={{ mt: 2, fontSize:'28px',color: '#000000', fontWeight: '600' }}> Not found </Typography>
        </Grid>
      )}
      </Box>

      <Chat />
      {addedMessage && (
        <div
          className={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            background: "#1f8f3a",
            color: "white",
            padding: "12px 16px",
            borderRadius: "10px",
            fontSize: "14px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            zIndex: 9999,
          }}
        >
          {addedMessage}
        </div>
      )}
    </div>
  )
};

export default Home;