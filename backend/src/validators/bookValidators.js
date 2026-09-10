class BookValidationException extends Error {}

export const validateBookPayload = (book) => {
  const currentYear = new Date().getFullYear();

  if (
    book.published_year !== undefined &&
    book.published_year !== null &&
    Number(book.published_year) > currentYear
  ) {
    throw new BookValidationException(
      "Publication year must be less than or equal to the current year"
    );
  }

  if (
    book.average_rating !== undefined &&
    book.average_rating !== null &&
    Number(book.average_rating) > 5
  ) {
    throw new BookValidationException(
      "Average rating must be less than or equal to 5"
    );
  }

  if (
    book.average_rating !== undefined &&
    book.average_rating !== null &&
    Number(book.average_rating) < 0
  ) {
    throw new BookValidationException(
      "Average rating must be greater than or equal to 0"
    );
  }

  if (!book.isbn13 || String(book.isbn13).trim() === "") {
    throw new BookValidationException("ISBN-13 is required");
  }

  const isbn13 = String(book.isbn13).replace(/[-\s]/g, "");

  if (!/^\d{13}$/.test(isbn13)) {
    throw new BookValidationException(
      "ISBN-13 has to contain exactly 13 digits"
    );
  }

  const mandatoryFields = [
    "title",
    "authors",
    "categories",
    "description",
    "price",
    "stock",
  ];

  for (const field of mandatoryFields) {
    const value = book[field];

    if (value === undefined || value === null) {
      throw new BookValidationException(`${field} is required`);
    }

    if (
      typeof value === "string" &&
      value.trim() === ""
    ) {
      throw new BookValidationException(`${field} is required`);
    }
  }

  if (Number(book.price) < 0) {
    throw new BookValidationException(
      "Price must be greater than or equal to 0"
    );
  }

  if (Number(book.stock) < 0) {
    throw new BookValidationException(
      "Stock must be greater than or equal to 0"
    );
  }

  if (
    book.num_pages !== undefined &&
    book.num_pages !== null &&
    book.num_pages !== "" &&
    Number(book.num_pages) <= 0
  ) {
    throw new BookValidationException(
      "Number of pages must be greater than 0"
    );
  }

  if (
    book.ratings_count !== undefined &&
    book.ratings_count !== null &&
    book.ratings_count !== "" &&
    Number(book.ratings_count) < 0
  ) {
    throw new BookValidationException(
      "Ratings count must be greater than or equal to 0"
    );
  }
};