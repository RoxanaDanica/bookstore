import express from 'express';
import cors from 'cors';
import { initializeDatabase } from './src/persistance/db.js';
import booksRouter from './src/routes/booksRoutes.js';
import uploadFileRouter from './src/routes/uploadFileRoute.js';
import chatRoute from './src/routes/chat.js';
import bookImportRoute from './src/routes/googleBooks.js';

const app = express()
app.use(express.json())
app.use(cors()); 

app.use(express.static('public'));

app.use('/test', (req, res) => {
  res.send('App worrks!');
});

app.use('/books', booksRouter);
app.use('/administrator', uploadFileRouter);
app.use('/api/chat', chatRoute);
app.use('/api', bookImportRoute);
async function startApp() {
  await initializeDatabase();
  app.listen(3000, () => {
    console.log('App started on port 3000');
});
}

startApp();