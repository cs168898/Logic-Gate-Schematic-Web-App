import axios from 'axios';

const REST_API_BASE_URL = 'http://localhost:8080/api/projects';

export const getAllProjects = (userId) => {
    return axios.get(`${REST_API_BASE_URL}?userId=${userId}`, {
        
    });
}
