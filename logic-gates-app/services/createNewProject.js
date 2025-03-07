import axios from 'axios';

const REST_API_BASE_URL = 'http://localhost:8080/api/projects';

export const  createProject = (projectName, userId, projectJSON = '') => {
    console.log("creating project to URL:", `${REST_API_BASE_URL}`);
    console.log("creating project with data:", {projectName, projectJSON });
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
