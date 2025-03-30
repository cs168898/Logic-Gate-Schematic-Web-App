import axios from 'axios';

const REST_API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/projects`;

export const  deleteProject = (projectId) => {
    return axios.delete(`${REST_API_BASE_URL}/${projectId}`);
}
