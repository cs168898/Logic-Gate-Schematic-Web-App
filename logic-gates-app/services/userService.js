import axios from 'axios';

const REST_API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/users`;

export const listUsers = () => {
    return axios.get(REST_API_BASE_URL);
}