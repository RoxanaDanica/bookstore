import { useEffect, useState } from 'react';
import { getBooks } from '../api/books';
import Grid from '@mui/joy/Grid';
import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
// import Button from '@mui/joy/Button';
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

function Home() {
  const [books, setBooks] = useState([]);
  const [value, setValue] = useState([0, 100]);
  const [filters, setFilters] = useState({
    searchTerm: '',
    authors: [],
    genres: [],
    price: {min:0, max: 100}
  });
  const uniqueAuthors = [...new Set(books.map(book => book.author))];
  const uniqueGenres = [...new Set(books.map(b => b.genre))];
  const [searchInputValue, setSearchInputValue] = useState('');

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

  
  function handleChangeInnput(textValue) {
    let term = textValue[0].toUpperCase() + textValue.slice(1);
    setSearchInputValue(textValue);
    console.log('searchInputValue', searchInputValue);
    if(textValue.length > 3) {
      setTimeout(() => {
        setFilters((prev) => ({
          ...prev,
          searchTerm: term
        }))
      }, 3000)
    }
  }
  function resetFilters() {
    setSearchInputValue('');
    setFilters({
      searchTerm: '',
      authors: [],
      genres: [],
      price: {min:0, max: 100}
    })
    
  }
  function clearSearch() {
    setSearchInputValue('');
    setFilters(prev => ({
      ...prev,
      searchTerm: ''
    }))
  }
  const filteredBooks = books.filter(book => {
    const matchesAuthor = filters.authors.length === 0 || filters.authors.includes(book.author);
    const matchesGenre = filters.genres.length === 0 || filters.genres.includes(book.genre);
    const matchesPrice = book.price >= value[0] && book.price <= value[1];
    const matchesSearch = filters.searchTerm === '' ||  book.title.includes(filters.searchTerm);
    return matchesAuthor && matchesGenre && matchesPrice && matchesSearch;
  });

  return ( 
    <Box sx= {{display: 'grid', gridTemplateColumns: '300px 1fr', width: '1300px' }}> 
      <Box>
        {!isFiltersEmpty() ? (    <Button variant="outlined" onClick={resetFilters}>  Reset All Filters </Button>) : ('')}
        <Box sx={{ display: 'flex', width: '100%', flexDirection: 'column', gap: 1, textAlign: "start" }}>
          <h3>Search for a Book</h3>
          <Box sx={{display: "flex", flexDirection: "row", justifyContent: 'space-between'}}>
            <TextField size="small" defaultValue={searchInputValue} value={searchInputValue} onChange={(e) => {handleChangeInnput(e.target.value)}} color="neutral" placeholder="Search for book" variant="outlined"  onKeyDown={(e) => { 
            if(e.key === "Enter"){
              setFilters(prev => ({...prev, searchTerm:  e.target.value[0]?.toUpperCase() + e.target.value.slice(1)}))
              console.log('tagret value', e.target.value);
            }}} />
            {filters.searchTerm != '' ? (<><IconButton sx={{marginRight:'10px'}} onClick={() => {clearSearch()}}> <DeleteIcon /></IconButton></>): ''}
          </Box>
        </Box>
        <Accordion defaultExpanded sx={{padding: '0 15px 0 0', margin: '20px 0 0 0'}} >
          <AccordionSummary disableGutters={true} sx={{outline: 'unset', fontSize: '18.8px', fontWeight: '700', outlineWidth: '0', focus}}>Author</AccordionSummary>
          <AccordionDetails>
            {uniqueAuthors.map(author => (
              <FormControlLabel sx={{marginLeft: '0', display: 'flex', gap: 1}}
              key={author}
              control={ <Checkbox checked={filters.authors.includes(author)} onChange={() => handleAuthorChange(author)} />}
              label={author} />
            ))}
          </AccordionDetails>
        </Accordion>
        <Accordion sx={{padding: '0 15px 0 0', margin: '20px 0 0 0'}}>
          <AccordionSummary disableGutters={true} sx={{outline: 'unset', fontSize: '18.8px', fontWeight: '700', outlineWidth: '0', focus}}>Genre</AccordionSummary>
          <AccordionDetails>
            {uniqueGenres.map(genre => (
              <FormControlLabel  sx={{marginLeft: '0', display: 'flex', gap: 1}}
              key={genre}
              control={ <Checkbox checked={filters.genres.includes(genre)} onChange={() => handleGenreChange(genre)} />}
              label={genre} />
            ))}
          </AccordionDetails>
        </Accordion>
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '200px', gap: 1, textAlign: "start"  }}>
          <h3>Price</h3>
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
          <Grid  sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 2 }}>
            {filteredBooks.map(item => 
            <Card key={item.id}  orientation="vertical" size="md" variant="outlined">
              <CardContent>
                <AspectRatio objectFit="contain">
                  {item.coverImage ? (
                    <img src={item.coverImage} srcSet={item.coverImage} />
                  ) : (
                    <img
                    src="https://images.unsplash.com/photo-1502657877623-f66bf489d236?auto=format&fit=crop&w=800"
                    srcSet="https://images.unsplash.com/photo-1502657877623-f66bf489d236?auto=format&fit=crop&w=800&dpr=2 2x"
                    alt="A beautiful landscape."
                  />  
                )}
                </AspectRatio>
                <Typography level="title-lg">{item.price} $</Typography>
                <Typography level="title-lg">{item.title}</Typography>
                <Typography level="body-md">{item.description}</Typography>
              </CardContent> 
              <CardActions> 
              <Button variant="contained">Purchase Now</Button>
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
  )
};

export default Home;