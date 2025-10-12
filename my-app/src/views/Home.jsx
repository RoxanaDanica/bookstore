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
import Input from '@mui/joy/Input';
import Accordion from '@mui/joy/Accordion';
import AccordionDetails from '@mui/joy/AccordionDetails';
import AccordionSummary from '@mui/joy/AccordionSummary';


function Home() {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        getBooks().then((response) => {
          setBooks(response.data);
        })
    }, []);
  
  const [value, setValue] = useState([0, 100]);
  function valuetext(value) {
    return `${value}°C`;
  }
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


    return ( 
    <Box sx= {{display: 'grid', gridTemplateColumns: '300px 1fr' }}> 
      <Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', width: 'fit-content', gap: 1, textAlign: "start" }}>
          <h3>Search for a Book</h3>
          <Input color="neutral" placeholder="Search for book" variant="outlined" />
        </Box>
        <Accordion defaultExpanded sx={{padding: '0 15px 0 0', margin: '20px 0 0 0'}}>
          <AccordionSummary disableGutters={true} sx={{outline: 'unset', fontSize: '18.8px', fontWeight: '700', outlineWidth: '0', focus}}>Author</AccordionSummary>
          <AccordionDetails>{books.map(book => 
            <Checkbox sx={{display: 'flex', gap: 1, mt: 1, textAlign: 'start'}} label={book.author} variant="outlined" />
          )}
          </AccordionDetails>
      </Accordion>
         <Accordion sx={{padding: '0 15px 0 0', margin: '20px 0 0 0'}}>
          <AccordionSummary disableGutters={true} sx={{outline: 'unset', fontSize: '18.8px', fontWeight: '700', outlineWidth: '0', focus}}>Genre</AccordionSummary>
          <AccordionDetails>{books.map(book => 
           <Checkbox sx={{display: 'flex', gap: 1, mt: 1, textAlign: 'start'}} label={book.genre} variant="outlined" />
        )}
          </AccordionDetails>
      </Accordion>
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '200px', gap: 1, textAlign: "start"  }}>
        <h3>Price</h3>
        <Slider
          getAriaLabel={() => 'Temperature range'}
          value={value}
          onChange={handleChange}
          valueLabelDisplay="auto"
          getAriaValueText={valuetext}
        />
      </Box>
      </Box>
      {books && (
        <div>
          <h2>Doing stuff with data</h2> 
          <Grid  sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 2 }}>
            {books.map(item => 
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
      )}
    </Box>
  )
};

export default Home;