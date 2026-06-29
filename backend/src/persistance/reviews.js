import { retrieveConnection } from "./db.js";

export const getReviewsByBook = async (bookId) => {
  const [reviews] = await retrieveConnection().execute(
    `
    SELECT 
      id,
      user_id,
      book_id,
      rating,
      comment,
      created_at
    FROM reviews
    WHERE book_id = ?
    ORDER BY created_at DESC
    `,
    [bookId]
  );

  return reviews;
};

export const insertReview = async (review) => {

  const {
    bookId,
    userId,
    rating,
    comment
  } = review;

  const [result] = await retrieveConnection().execute(
    `
    INSERT INTO reviews
    (
      id,
      user_id,
      book_id,
      rating,
      comment
    )
    VALUES
    (
      UUID(),
      ?, ?, ?, ?
    )
    `,
    [
      userId,
      bookId,
      rating,
      comment
    ]
  );
  return {
    id: result.insertId,
    bookId,
    userId,
    rating,
    comment
  };
};