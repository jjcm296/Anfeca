import axios from 'axios';

export const ApiLogin = async (email, password) => {
    try {
        const response = await axios.post('http://148.226.202.182:3000/api/auth/login', { email, password });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

