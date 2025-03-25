import axios from 'axios';

const REST_API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/projects`;

export const  createProject = (projectName, userId, projectJSON = '') => {
    return axios.post(`${REST_API_BASE_URL}`, {
        projectName,
        userId,
        projectJSON
    },
    {
        headers: {
            "Content-Type": "application/json"
        }
    }
    );
}
