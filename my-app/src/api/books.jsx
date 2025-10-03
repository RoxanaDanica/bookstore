import { getAxiosInstance } from "./axios";


const getBooks = async () => {
  const data = await getAxiosInstance().get('/');
  return data;
};




export { 
  getBooks
};
