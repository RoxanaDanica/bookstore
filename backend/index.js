import express from 'express';
import cors from 'cors';
import { initializeDatabase } from './src/persistance/db.js';
import booksRouter from './src/routes/booksRoutes.js';
import reviewRoute from './src/routes/reviewRoute.js';
import uploadFileRouter from './src/routes/uploadFileRoute.js';
import chatRoute from './src/routes/chat.js';
import usersRoute from './src/routes/usersRoutes.js';
import authRouter from './src/routes/authRoutes.js';
import cartRouter from './src/routes/cartRouter.js';

const app = express()
app.use(express.json())
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://ivory-and-ink.pages.dev",
    ],
  })
);

app.use(express.static('public'));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/books', booksRouter);
app.use('/api/administrator', uploadFileRouter);
app.use('/api/chat', chatRoute);
app.use('/api/users', usersRoute);
app.use('/api/reviews', reviewRoute);
app.use('/api/auth', authRouter);
app.use('/api/cart', cartRouter);
const PORT = process.env.PORT || 3000;

async function startApp() {
  try {
    await initializeDatabase();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`App started on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start application:", error);
    process.exit(1);
  }
}

startApp();