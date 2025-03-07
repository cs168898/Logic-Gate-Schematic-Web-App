import axios from 'axios';

const REST_API_BASE_URL = 'http://localhost:8080/api/projects';

export const getProjectById = (projectId) => {
    return axios.get(`${REST_API_BASE_URL}/${projectId}`, {
        
    });
}
