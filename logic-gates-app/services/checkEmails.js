import axios from 'axios';

const REST_API_BASE_URL = 'http://localhost:8080/api/users/exists/check-email';

export const checkEmail = (email) => {
    return axios.get(REST_API_BASE_URL, {
        params: { email: email.trim() } // Send email as query parameter
    });
};