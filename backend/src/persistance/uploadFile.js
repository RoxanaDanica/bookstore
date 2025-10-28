import { retrieveConnection } from "./db.js";

export const createBooks = async(data) => {
    // for(let i=0; i<=data.length; i++) {
    //     console.log('data in persistance', data);
    //     const { id,title, author,  genre, publisher, publicationYear, isbn, language, pages, description, coverImage, rating, availableCopies, price } = data;
    //     const [newBook] = await retrieveConnection().execute('INSERT INTO books(`id`,`title`,`author`,`genre`,`publisher`,`publicationYear`,`isbn`,`language`,`pages`,`description`,`coverImage`,`rating`,`availableCopies`,`price`) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [id, title, author, genre, publisher, publicationYear, isbn, language, pages, description, coverImage, rating, availableCopies, price]);
    // }
   
    console.log(data);
    return data;
}  
