import express from 'express';
import cors from 'cors';
import { initializeDatabase } from './src/persistance/db.js';
import booksRouter from './src/routes/booksRoutes.js';
import reviewRoute from './src/routes/reviewRoute.js';
import uploadFileRouter from './src/routes/uploadFileRoute.js';
import chatRoute from './src/routes/chat.js';
import usersRoute from './src/routes/usersRoutes.js';

const app = express()
app.use(express.json())
app.use(cors()); 

app.use(express.static('public'));

app.use('/test', (req, res) => {
  res.send('App worrks!');
});

app.use('/api/books', booksRouter);
app.use('/api/administrator', uploadFileRouter);
app.use('/api/chat', chatRoute);
app.use('/api/users', usersRoute);
app.use('/api/reviews', reviewRoute);
async function startApp() {
  await initializeDatabase();
  app.listen(3000, () => {
    console.log('App started on port 3000');
});
}

startApp();