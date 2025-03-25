import axios from 'axios';

const REST_API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/projects`;

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
