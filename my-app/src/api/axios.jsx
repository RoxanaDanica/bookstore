import axios from 'axios';

export const getAxiosInstance = () => {
    return axios.create({
        baseURL: 'http://localhost:3000'
    });
};
