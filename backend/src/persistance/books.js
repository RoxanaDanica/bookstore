import { retrieveConnection } from "./db.js";

export const getBooks = async (limit, offset, filters) => {
  let joinSql = "";
  let whereSql = `
    WHERE 1 = 1
  `;

  const values = [];

  if (Array.isArray(filters.genre) && filters.genre.length > 0) {
    joinSql += `
      JOIN book_categories bc
        ON bc.book_id = b.id

      JOIN categories c
        ON c.id = bc.category_id
    `;

    const placeholders = filters.genre
      .map(() => "?")
      .join(",");

    whereSql += `
      AND c.name IN (${placeholders})
    `;

    values.push(...filters.genre);
  }

if (Array.isArray(filters.author) && filters.author.length > 0) {
    joinSql += `
      JOIN book_authors ba
        ON ba.book_id = b.id

      JOIN authors a
        ON a.id = ba.author_id
    `;

    const placeholders = filters.author
      .map(() => "?")
      .join(",");

    whereSql += `
      AND a.name IN (${placeholders})
    `;

    values.push(...filters.author);
  }

  if (filters.search) {
    whereSql += `
      AND b.title LIKE ?
    `;

    values.push(`%${filters.search}%`);
  }

  if (filters.minPrice !== null) {
    whereSql += `
      AND b.price >= ?
    `;

    values.push(Number(filters.minPrice));
  }

  if (filters.maxPrice !== null) {
    whereSql += `
      AND b.price <= ?
    `;

    values.push(Number(filters.maxPrice));
  }

  const [books] = await retrieveConnection().execute(
    `
      SELECT DISTINCT b.*
      FROM books b
      ${joinSql}
      ${whereSql}
      ORDER BY b.id ASC
      LIMIT ${Number(limit)}
      OFFSET ${Number(offset)}
    `,
    values
  );

  const [countResult] = await retrieveConnection().execute(
    `
      SELECT COUNT(DISTINCT b.id) AS total
      FROM books b
      ${joinSql}
      ${whereSql}
    `,
    values
  );

  return {
    books,
    total: countResult[0].total,
  };
};

export const getBook = async(id) => {
    const [book] = await retrieveConnection().execute('SELECT * FROM `books` WHERE `id` = ?',  [id]);
    return book;
} 

export const getBooksCategories = async() => {
    const [bookCategories] = await retrieveConnection().execute(`
      SELECT b.categories, b.thumbnail
      FROM books b
      WHERE b.id IN (
          SELECT MIN(id)
          FROM books
          WHERE categories IS NOT NULL
          GROUP BY categories
      )
      LIMIT 8;
      `);
    return bookCategories;
}

export const getTopRatedBooks = async (limit = 20, page = 1) => {
  const offset = (page - 1) * limit;

  const [books] = await retrieveConnection().execute(
    `
      SELECT *
      FROM books
      WHERE average_rating IS NOT NULL
      ORDER BY average_rating DESC, ratings_count DESC
      LIMIT ? OFFSET ?
    `,
    [String(limit), String(offset)]
  );

  const [countResult] = await retrieveConnection().execute(`
    SELECT COUNT(*) AS total
    FROM books
    WHERE average_rating IS NOT NULL
  `);

  const total = countResult[0].total;

  return {
    books,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

export const removeBook = async(id) => {
    const [book] = await retrieveConnection().execute('DELETE FROM books WHERE `id` = ?', [id]);
    return book;
}

export const createBook = async (book) => {
  const {
    isbn13,
    isbn10,
    title,
    subtitle,
    authors,
    categories,
    thumbnail,
    description,
    published_year,
    average_rating,
    num_pages,
    ratings_count,
    price,
    stock,
  } = book;

  const [newBook] = await retrieveConnection().execute(
    ` INSERT INTO books (isbn13, isbn10, title,subtitle, authors, categories, thumbnail, description, published_year, average_rating, num_pages, ratings_count, price, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) `,
    [ isbn13,isbn10,title,subtitle,authors,categories,thumbnail,description,published_year,average_rating,num_pages,ratings_count,price,stock,]
  );

  return newBook;
};

export const modifiedBook = async (id, modifyBook) => {
  const {
    isbn13,
    isbn10,
    title,
    subtitle,
    authors,
    categories,
    thumbnail,
    description,
    published_year,
    average_rating,
    num_pages,
    ratings_count,
    price,
    stock,
  } = modifyBook;

  const [result] = await retrieveConnection().execute(
    `UPDATE books SET isbn13 = ?, isbn10 = ?, title = ?, subtitle = ?,  authors = ?, categories = ?, thumbnail = ?, description = ?,  published_year = ?, average_rating = ?, num_pages = ?, ratings_count = ?, price = ?,  stock = ? WHERE id = ? `,
    [ isbn13, isbn10, title, subtitle, authors, categories, thumbnail, description,  published_year,  average_rating,  num_pages, ratings_count,  price, stock, id, ]);

  return result;
};

export const searchBooksByTitle = async (title) => {
  const [books] = await retrieveConnection().execute(
    `
    SELECT *
    FROM books
    WHERE LOWER(title) LIKE LOWER(?)
    LIMIT 10
    `,
    [`%${title}%`]
  );

  return books;
};

export const getAllGenres = async () => {
  const [rows] = await retrieveConnection().execute(`
    SELECT name
    FROM categories
    ORDER BY name ASC
  `);

  return rows.map((row) => row.name);
};

export const getAllAuthors = async () => {
  const [rows] = await retrieveConnection().execute(`
    SELECT name
    FROM authors
    ORDER BY name ASC
  `);

  return rows.map((row) => row.name);
};