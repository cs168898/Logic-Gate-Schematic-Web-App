import axios from 'axios';

const REST_API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/users/register`;

export const registerUser = (username, email, password) => {
    return axios.post(`${REST_API_BASE_URL}?password=${password}`, {
        username: username,
        email: email
    });
}