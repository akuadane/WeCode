import axios from "axios";
import { signIn, signOut, signUp, useSession } from "./auth-client";
const apiUrl = import.meta.env.VITE_API_URL;

interface LoginData {
    email: string
}

interface RegisterData {
    email: string,
    name: string
}


const authService = {
    login: async (data: LoginData) => {
            const response = await axios.post(`${apiUrl}/auth/login`, data);
            return response.data;
    },
    register: async (data: RegisterData) => {
        const response = await axios.post(`${apiUrl}/auth/register`, data);
        return response.data;
    },
    loginDemo: async () => {
        return true; 
    }
}

export default authService;