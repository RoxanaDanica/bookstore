import { initializeDatabase, retrieveConnection } from './src/persistance/db.js';

function getRandomPrice() {
  return +(Math.random() * (50 - 5) + 5).toFixed(2); 
}

async function addPrices() {
  try {
    await initializeDatabase();
    const db = retrieveConnection();

    const [books] = await db.execute(`SELECT id FROM books`);

    console.log(`Found ${books.length} books`);

    for (const book of books) {
      const price = getRandomPrice();

      await db.execute(
        `UPDATE books SET price = ? WHERE id = ?`,
        [price, book.id]
      );
    }

    console.log(" Done: prices added!");
    process.exit(0);

  } catch (err) {
    console.error(" Error:", err.message);
    process.exit(1);
  }
}

addPrices();