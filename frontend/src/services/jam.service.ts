import axios from "axios";
import type { CreateJamFromPlanData, JamSnippet, JamUser, JamProblemUser } from "../types/jam.types";

const apiUrl = import.meta.env.VITE_API_URL;

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
        return response.data as JamSnippet[];
    },

    addUser: async (data: JamUser) => {
        const response = await axios.post(`${apiUrl}/jam/adduser`, data);
        return response.data;
    },

    removeUser: async (data: JamUser) => {
        const response = await axios.post(`${apiUrl}/jam/removeuser`, data);
        return response.data;
    },

    markProblemSolved: async (data: JamProblemUser) => {
        const response = await axios.patch(`${apiUrl}/jam/solved`, data);
        return response.data;
    },

    markProblemUnsolved: async (data: JamProblemUser) => {
        const response = await axios.patch(`${apiUrl}/jam/unsolved`, data);
        return response.data;
    },

    createLiveJam: async (jam_id: string) => {
        const response = await axios.post(`${apiUrl}/jam/createLiveJam`, {jam_id});
        return response.data;
    },

    endLiveJam: async (jam_id: string) => {
        const response = await axios.post(`${apiUrl}/jam/endLiveJam`, {jam_id});
        return response.data;
    }
};

export default jamService;