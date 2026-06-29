import express from 'express';
import { retrieveReviews, addReview } from '../services/reviewsService.js';

const reviewRoute = express.Router();

reviewRoute.get("/:bookId", async (req, res) => {
  try {

    const { bookId } = req.params;
    const reviews = await retrieveReviews(bookId);
    res.status(200).json(reviews);
  } catch (err) {
    console.log("BACKEND ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

reviewRoute.post("/", async (req, res) => {
  try {
    const { bookId, userId, rating, comment } = req.body;

    if (!bookId || !rating) {
      return res.status(400).json({
        error: "bookId and rating are required"
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        error: "rating must be between 1 and 5"
      });
    }

    const review = await addReview({
      bookId,
      userId,
      rating,
      comment
    });

    res.status(201).json(review);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

 
export default reviewRoute;