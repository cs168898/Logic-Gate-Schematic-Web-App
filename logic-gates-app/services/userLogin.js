import axios from 'axios';

const REST_API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/users/login`;

export const loginUser = (username, password) => {
    return axios.post(REST_API_BASE_URL, {
        username: username,
        password: password
    });
}