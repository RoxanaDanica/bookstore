import { getAxiosInstance } from "./axios";


const getBooks = async () => {
  const data = await getAxiosInstance().get('/books/');
  return data;
};
const getBook = async (id) => {
  const response = await getAxiosInstance().get(`/books/${id}`);
  return response.data;
};

const deleteBook = async (id) => {
  const data = await getAxiosInstance().delete(`/books/${id}`) ;
  console.log('data=>', data);
  return data;
}
const updateBook = async (id, book) => {
  const data = await getAxiosInstance().put(`/books/${id}`, book);
  console.log('data=>', data);
  return data;

}
const addBook = async (book) => {
  const data = await getAxiosInstance().post('/books', book);
  return data;
}
export { 
  getBooks, 
  getBook,
  deleteBook,
  updateBook,
  addBook
};
