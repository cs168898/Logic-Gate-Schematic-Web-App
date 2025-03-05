
// Purpose: This file contains functions to interact with the backend API from the React frontend. 
// It uses axios to send HTTP requests to the backend endpoints defined in LogicGateController.java.

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/logicgates';

export const storeLogicGates = async (jsonInput) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/store`, jsonInput, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error storing logic gates:', error);
    throw error;
  }
};

export const retrieveLogicGates = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/retrieve_proj_list`);
    return response.data;
  } catch (error) {
    console.error('Error retrieving logic gates:', error);
    throw error;
  }
};
