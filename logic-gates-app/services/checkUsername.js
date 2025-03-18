import axios from 'axios';

const REST_API_BASE_URL = 'http://localhost:8080/api/users/exists/check-username';

export const checkUsername = async (username) => {
    try {
        return await axios.get(REST_API_BASE_URL, {
            params: { username: username.trim() }
        });
    } catch (error) {
        throw error;
    }
};