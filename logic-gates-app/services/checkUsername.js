import axios from 'axios';

const REST_API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/users/exists/check-username`;

export const checkUsername = async (username) => {
    try {
        return await axios.get(REST_API_BASE_URL, {
            params: { username: username.trim() }
        });
    } catch (error) {
        throw error;
    }
};