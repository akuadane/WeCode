import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

interface CreateJamFromPlanData {
    plan_id: number;
    user_id: number;
    name: string;
    prob_goal_per_day: number;
    start_date: string;
    end_date: string;
    status: number;
    live_call: boolean;
}

interface UserData {
    jam_id: number;
    user_id: number;
}

interface ProblemUserData {
    jam_problem_id: number;
    user_id: number;
}

const jamService = {
    getJam: async (id: string) => {
        const response = await axios.get(`${apiUrl}/jam/${id}`);
        return response.data;
    },

    createFromPlan: async (data: CreateJamFromPlanData) => {
        const response = await axios.post(`${apiUrl}/jam/createFromPlan`, data);
        return response.data;
    },

    getOngoingJams: async () => {
        const response = await axios.get(`${apiUrl}/jam/ongoing`);
        return response.data;
    },

    addUser: async (data: UserData) => {
        const response = await axios.post(`${apiUrl}/jam/adduser`, data);
        return response.data;
    },

    removeUser: async (data: UserData) => {
        const response = await axios.post(`${apiUrl}/jam/removeuser`, data);
        return response.data;
    },

    markProblemSolved: async (data: ProblemUserData) => {
        const response = await axios.patch(`${apiUrl}/jam/solved`, data);
        return response.data;
    },

    markProblemUnsolved: async (data: ProblemUserData) => {
        const response = await axios.patch(`${apiUrl}/jam/unsolved`, data);
        return response.data;
    }
};

export default jamService;