import axios from 'axios';
 
const API_URL = 'https://api.chatgpt.com';
 
export default {
  async getResponse(message) {
    //const response = await axios.post(`${API_URL}/api/chat`, { message });
    const response = await axios.post('/chatgpt', { message });
    return response.data;
  },
};