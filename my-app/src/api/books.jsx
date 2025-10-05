import { getAxiosInstance } from "./axios";


const getBooks = async () => {
  const data = await getAxiosInstance().get('/books/');
  return data;
};




export { 
  getBooks
};
