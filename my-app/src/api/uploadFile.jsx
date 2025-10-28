import { getAxiosInstance } from "./axios";

const addDocument = async (document) => {
  const formData = new FormData();
  formData.append('file', document);

  const data = await getAxiosInstance().post('/administrator', formData, {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
  });
  console.log('data in api', data);
  return data;
}

export {
    addDocument
};