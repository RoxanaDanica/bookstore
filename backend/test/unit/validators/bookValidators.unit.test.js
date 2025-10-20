import { validateBookPayload } from '../../../src/validators/bookValidators';

describe("Book Validation Unit Tests", () => {
    const testBook = {
        "id": 35,
        "title": "To Kill a Mockingbird",
        "author": "Harper Lee",
        "genre": "Classic / Fiction",
        "publisher": "J.B. Lippincott & Co.",
        "publicationYear": 1960,
        "isbn": "9780061120084",
        "language": "English",
        "pages": 336,
        "description": "A novel about the serious issues of rape and racial inequality, seen through the eyes of young Scout Finch in the Deep South.",
        "coverImage": "https://images-na.ssl-images-amazon.com/images/I/81OtwkiB1LL.jpg",
        "rating": 4.9,
        "availableCopies": 15,
        "price": 20
    };

    it("should throw an error if the publication year is greater than current year.", () => {
        const invalidBook = {...testBook,  publicationYear: new Date().getFullYear() + 5} 
        expect(() => validateBookPayload(invalidBook)).toThrow('Publication Year must be less or equal then current date');
    })
    it("Should throw an error if title field is empty", () => {
        const invalidBook = {...testBook, title: '  '}
        expect(()=> validateBookPayload(invalidBook)).toThrow('title is required')
    })
    it("Should throw an error if isbn doesn't contain exactly 13 digits", () => {
        const invalidBook = {...testBook, isbn: '97800611200'}
        expect(()=> validateBookPayload(invalidBook)).toThrow('ISBN has to contain 13 digits')
    })
        it("Should throw an error if price field is empty", () => {
        const invalidBook = {...testBook, price: 0}
        expect(()=> validateBookPayload(invalidBook)).toThrow('price is required')
    })
    it("should not throw an error for valid book", () => {
        expect(() => validateBookPayload(testBook)).not.toThrow();
    })
});