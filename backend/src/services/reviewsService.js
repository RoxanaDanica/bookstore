import { getReviewsByBook, insertReview } from "../persistance/reviews.js";

export const retrieveReviews = async (bookId) => {
  return await getReviewsByBook(bookId);
};

export const addReview = async (review) => {
  return await insertReview(review);
};