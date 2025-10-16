import express from 'express';
import cors from 'cors';
import { initializeDatabase } from './src/persistance/db.js';
import booksRouter from './src/routes/booksRoutes.js';
 

const app = express()
app.use(express.json())
app.use(cors()); 


app.use('/books', booksRouter);


app.listen(3000, () => {
    console.log('App started on port 3000');
});

async function startApp() {
  await initializeDatabase();
}

startApp();