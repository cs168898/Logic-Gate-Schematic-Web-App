import axios from 'axios';

const REST_API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/projects`;

export const getProjectById = (projectId) => {
    return axios.get(`${REST_API_BASE_URL}/${projectId}`, {
        
    });
}
