import axios from 'axios';

const REST_API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/projects`;

export const getAllProjects = (userId) => {
    return axios.get(`${REST_API_BASE_URL}?userId=${userId}`, {
        
    });
}
