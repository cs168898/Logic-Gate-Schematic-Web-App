import axios from 'axios';

const REST_API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/ai/generate`;

export const generateSchematic = (userInput, existingGates) => {
    return axios.post(REST_API_BASE_URL, {
        userInput,
        existingGates
    });
};