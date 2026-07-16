import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchContent = async (language = 'en') => {
  try {
    const response = await api.get(`/content?language=${language}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching content:', error);
    return null;
  }
};

export const postQuery = async (query) => {
  try {
    const response = await api.post('/query', { query_text: query });
    return response.data; 
  } catch (error) {
    console.error('Error posting query:', error);
    if (error.response) {
      return { 
        error: `An error occurred: ${error.response.data.detail || error.response.statusText}` 
      };
    }
    return { error: 'Could not connect to the server. Please ensure it is running.' };
  }
};

export default api;
