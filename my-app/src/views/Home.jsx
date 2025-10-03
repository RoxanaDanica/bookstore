import { useEffect, useState } from 'react';
import { getBooks } from '../api/books';

function Home() {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        console.log('home page');
        getBooks().then((response) => {
            console.log(response.data);
            setBooks(response.data);
        })
    }, []);

    return ( 
    <div> 
    {books && (
      <div>
        <h2>Doing stuff with data</h2>
        {books.map(item => (<span>{item.title}</span>))}
      </div>
    )}
    </div>
  )
};

export default Home;