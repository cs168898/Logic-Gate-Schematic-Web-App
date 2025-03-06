import axios from 'axios';

const REST_API_BASE_URL = 'http://localhost:8080/api/users/register';

export const registerUser = (username, email, password) => {
    return axios.post(`${REST_API_BASE_URL}?password=${password}`, {
        username: username,
        email: email
    });
}