class BookValidationException extends Error {

}

export const validateBookPayload = (book) => {
    const currentYear = new Date().getFullYear();

    if(book.publicationYear > currentYear) {
        console.log('publication year');
        throw new BookValidationException('Publication Year must be less or equal then current date');
    }
    if(book.rating > 5) {
        throw new BookValidationException('Rating must be less or equal then 5');
    }
    if(book.isbn == '') {
        throw new BookValidationException('ISBN is required');
    } else if(book.isbn.length != 13) {
        throw new BookValidationException('ISBN has to contain 13 digits');
    }
    const mandatoryFields = ['title', 'author', 'genre', 'publisher', 'language', 'pages', 'description', 'availableCopies', 'price'];
    for(const field of mandatoryFields) {
        if (typeof book[field] === 'string' && book[field].trim() === '') {
            throw new BookValidationException(`${field} is required`);
        }
        if(!book[field]) {
            throw new BookValidationException(`${field} is required`);
        }
    }
}
