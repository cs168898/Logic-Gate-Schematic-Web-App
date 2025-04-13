import axios from 'axios';

const REST_API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/verify`;

export const verifyEmail = (token) => {
    return axios.post(REST_API_BASE_URL, {
        params: { token }
    });
};