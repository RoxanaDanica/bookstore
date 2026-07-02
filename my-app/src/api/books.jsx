import { getAxiosInstance } from "./axios";


const getBooks = (limit, page, filters = {}) => {

  let url = `/books?limit=${limit}&page=${page}`;

  if(filters.search){
    url += `&search=${filters.search}`;
  }

  if(filters.genre){
    url += `&genre=${filters.genre}`;
  }

  if(filters.author){
    url += `&author=${filters.author}`;
  }


  return getAxiosInstance().get(url);
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

const getReviews = async (bookId) => {
  const response = await getAxiosInstance().get(`/reviews/${bookId}`);
  return response.data;
};

const addReview = async (review) => {
  const response = await getAxiosInstance().post("/reviews", review);
  return response.data;
};

export { 
  getBooks, 
  getBook,
  deleteBook,
  updateBook,
  addBook,
  getReviews,
  addReview
};
