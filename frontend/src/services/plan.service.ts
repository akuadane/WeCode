import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const planService = {
    getPlans: async () => {
        const response = await axios.get(`${apiUrl}/plan/all`);
        return response.data;
    },
    getPlan: async (id: string) => {
        const response = await axios.get(`${apiUrl}/plan/${id}`);
        return response.data;
    }
}

export default planService;