import { initializeDatabase, retrieveConnection } from './src/persistance/db.js';

const createBooksTable = async () => {
  const connection = await retrieveConnection();

  await connection.execute(`
      CREATE TABLE IF NOT EXISTS books (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(100),
        author VARCHAR(100),
        genre VARCHAR(100),
        publisher VARCHAR(100),
        publicationYear INT NOT NULL,
        isbn VARCHAR(255),
        language VARCHAR(100),
        pages INT NOT NULL,
        description TEXT,
        coverImage VARCHAR(255),
        rating SMALLINT(5),
        availableCopies INT NOT NULL,
        price INT NOT NULL
    );
  `);

};

const deleteBooksTable = async () => {
    await retrieveConnection().execute(`
        DROP TABLE books;
    `)
}

const insertBooks = async () => {
    await retrieveConnection().execute(`
        INSERT INTO books (id, title, author, genre, publisher, publicationYear, isbn, language, pages, description, coverImage, rating, availableCopies, price)
        VALUES
        (1, 'Pride and Prejudice', 'Jane Austen', 'Romance', 'Penguin Classics', 1813, '9780141439518', 'Romanian', 432, 'A classic story about love, prejudice, and social conventions.', 'https://d28hgpri8am2if.cloudfront.net/book_images/onix/cvr9781471134746/pride-and-prejudice-9781471134746_hr.jpg', 4.8, 12, 15),
        (2, 'Crime and Punishment', 'Fyodor Dostoevsky', 'Classic / Psychological', 'Humanitas', 1866, '9789735014928', 'Romanian', 576, 'A psychological novel about guilt, conscience, and redemption.', 'https://eastindiapublishing.com/cdn/shop/files/CrimeandPunishment-01.png?v=1706581156&width=713', 4.7, 9, 15),
        (3, 'The Little Prince', 'Antoine de Saint-Exupéry', 'Story / Philosophical', 'Rao', 1943, '9789731032056', 'Romanian', 96, 'A poetic story about innocence, friendship, and love.', 'https://prodimage.images-bn.com/pimages/9798765532645_p0_v1_s600x595.jpg', 4.9, 20, 15),
        (4, '1984', 'George Orwell', 'Dystopia', 'Polirom', 1949, '9789734617991', 'Romanian', 328, 'A dystopian novel about surveillance, freedom, and totalitarianism.', 'https://miro.medium.com/v2/1*g8s4n-puPV3y-F2b7ilJ_A.jpeg', 4.8, 14, 15),
        (5, 'Les Misérables', 'Victor Hugo', 'Classic / Drama', 'Litera', 1862, '9789736752362', 'Romanian', 1456, 'A masterpiece about justice, love, and sacrifice.', 'https://www.harryhartog.com.au/cdn/shop/products/9781435163690.jpg?v=1662065139', 4.7, 7, 70),
        (6, "Harry Potter and the Philosopher\'s Stone", 'J.K. Rowling', 'Fantasy', 'Arthur', 1997, '9786067885249', 'Romanian', 336, 'The first volume of the famous Harry Potter series.', '', 4.9, 25, 25),
        (7, 'The Hobbit', 'J.R.R. Tolkien', 'Fantasy / Adventure', 'Arthur', 1937, '9789731033244', 'Romanian', 310, "Bilbo Baggins\' adventure in the fascinating world of Middle-earth.", '', 4.8, 18, 15),
        (8, 'Don Quixote', 'Miguel de Cervantes', 'Classic / Adventure', 'Litera', 1605, '9789736759994', 'Romanian', 1056, 'The story of the wandering knight Don Quixote and his squire Sancho Panza.', '', 4.6, 10, 15),
        (9, 'Frankenstein', 'Mary Shelley', 'Horror / Gothic', 'Penguin', 1818, '9780143131846', 'Romanian', 288, 'A gothic novel about a scientist who creates a monster.', '', 4.5, 11, 30),
        (10, 'The Catcher in the Rye', 'J.D. Salinger', 'Contemporary Fiction', 'Polirom', 1951, '9789736818233', 'Romanian', 240, 'The famous story of Holden Caulfield about adolescence and rebellion.', '', 4.4, 13, 15),
        (11, 'Anna Karenina', 'Lev Tolstoy', 'Classic / Drama', 'Humanitas', 1878, '9789735062461', 'Romanian', 864, 'A novel about love, betrayal, and society in 19th century Russia.', '', 4.7, 10, 15),
        (12, 'Alice in Wonderland', 'Lewis Carroll', 'Fantasy / Adventure', 'Rao', 1865, '9789731034999', 'Romanian', 200, "Alicel\'s fantastic journey in a strange and wonderful world.", '', 4.6, 15, 15),
        (13, 'The Castle', 'Franz Kafka', 'Fiction / Absurd', 'Polirom', 1926, '9789734601857', 'Romanian', 288, "A novel about man\'s struggle against bureaucracy and absurdity.", '', 4.3, 9, 15),
        (14, 'Lolita', 'Vladimir Nabokov', 'Controversial Fiction', 'Polirom', 1955, '9789734609281', 'Romanian', 336, 'A novel about obsession and morality, considered modern classic.', '', 4.4, 11, 15),
        (15, 'The Most Beloved of Earthlings', 'Marin Preda', 'Romanian Fiction', 'Editura Eminescu', 1980, '9789735901456', 'Romanian', 672, 'A novel about the life of an intellectual during the communist period.', '', 4.6, 12, 45),
        (16, 'The Trial', 'Franz Kafka', 'Fiction / Absurd', 'Polirom', 1925, '9789734601840', 'Romanian', 256, 'A man is arrested and tried without knowing why.', '', 4.3, 10, 15),
        (17, 'The Three Musketeers', 'Alexandre Dumas', 'Adventure / Classic', 'Litera', 1844, '9789736752249', 'Romanian', 688, "The adventures of d\'Artagnan and the three musketeers in 17th century France.", '', 4.7, 15, 15),
        (18, "The Handmaid\'s Tale", 'Margaret Atwood', 'Dystopia / Feminism', 'Polirom', 1985, '9789734618302', 'Romanian', 336, 'A totalitarian society where women are subjected and controlled.', '', 4.5, 13, 15),
        (19, 'The Diary of Anne Frank', 'Anne Frank', 'Memoirs / History', 'Humanitas', 1947, '9789735062300', 'Romanian', 336, 'The diary of a Jewish teenage girl hiding during the Nazi occupation.', '', 4.8, 18, 45),
        (20, 'Bel-Ami', 'Guy de Maupassant', 'Classic / Drama', 'Litera', 1885, '9789736752370', 'Romanian', 320, 'A novel about social rise and manipulation in Parisian society.', '', 4.4, 10, 15),
        (21, 'Hamlet', 'William Shakespeare', 'Drama / Tragedy', 'Humanitas', 1603, '9789735062500', 'Romanian', 200, "The tragedy of the Danish prince seeking revenge for his father\'s death.", '', 4.7, 12, 15),
        (22, 'Nineteen Eighty-Four', 'George Orwell', 'Dystopia', 'Polirom', 1949, '9789734617992', 'Romanian', 328, 'A novel about surveillance, freedom, and totalitarianism.', '', 4.8, 14, 55),
        (23, 'Fahrenheit 451', 'Ray Bradbury', 'Dystopia / Sci-Fi', 'Polirom', 1953, '9789734607002', 'Romanian', 249, 'A society where books are forbidden and burned.', '', 4.6, 11, 15),
        (24, 'Dracula', 'Bram Stoker', 'Horror / Gothic', 'Polirom', 1897, '9789734618301', 'Romanian', 418, 'A classic gothic novel about Count Dracula.', '', 4.7, 13, 15),
        (25, 'Shining', 'Stephen King', 'Horror / Thriller', 'Editura Nemira', 1977, '9789733209500', 'Romanian', 447, 'A haunted hotel and a writer trapped in a spiral of madness.', '', 4.5, 10, 15),
        (26, 'The Chronicles of Narnia: The Lion, the Witch and the Wardrobe', 'C.S. Lewis', 'Fantasy / Adventure', 'Rao', 1950, '9789731033000', 'Romanian', 208, 'The Pevensie children discover a magical world through a wardrobe.', '', 4.8, 15, 15),
        (27, 'Percy Jackson and the Lightning Thief', 'Rick Riordan', 'Fantasy / Adventure', 'Arthur', 2005, '9786067884006', 'Romanian', 384, 'The first volume of the Percy Jackson series based on Greek mythology.', '', 4.7, 18, 15),
        (28, 'The Famous Five', 'Enid Blyton', 'Adventure / Children', 'Rao', 1942, '9789731032040', 'Romanian', 192, 'A series of adventures of young detectives.', '', 4.4, 14, 15),
        (29, 'Alice Through the Looking-Glass', 'Lewis Carroll', 'Fantasy / Adventure', 'Rao', 1871, '9789731035000', 'Romanian', 208, "The continuation of Alice\'s adventures in a strange and fascinating world.", '', 4.5, 12, 15),
        (30, 'Life of Pi', 'Yann Martel', 'Fiction / Adventure', 'Polirom', 2001, '9789734614358', 'Romanian', 400, 'The story of a boy stranded on a boat with a tiger in the middle of the ocean.', '', 4.7, 16, 15);
    `)
}

initializeDatabase().then(() => {
    // insertBooks();
    // deleteBooksTable();
    // createBooksTable();
});
