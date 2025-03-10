import axios from 'axios';

const REST_API_BASE_URL = 'http://localhost:8080/api/projects';

export const  saveProject = (projectId, projectName, projectJSON) => {
    return axios.put(`${REST_API_BASE_URL}/${projectId}`, {
        projectId,
        projectName,
        projectJSON
    },
    {
        headers: {
            "Content-Type": "application/json"
        }
    }
    );
}
