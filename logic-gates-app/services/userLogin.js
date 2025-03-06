import axios from 'axios';

const REST_API_BASE_URL = 'http://localhost:8080/api/users/login';

export const loginUser = (username, password) => {
    return axios.post(REST_API_BASE_URL, {
        username: username,
        password: password
    });
}