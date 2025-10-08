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



function Home() {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        getBooks().then((response) => {
          setBooks(response.data);
        })
    }, []);

    return ( 
    <div> 
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
    </div>
  )
};

export default Home;