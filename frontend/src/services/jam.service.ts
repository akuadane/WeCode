import axios from "axios";
import type { CreateJamFromPlanData, JamSnippet, AddJamUserPayload, RemoveJamUserPayload, JamProblemUser } from "../types/jam.types";

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

    getOngoingJams: async (user_id: string) => {
        const response = await axios.get(`${apiUrl}/jam/ongoing`,{params: {user_id}});
        return response.data as JamSnippet[];
    },

    addUser: async (data: AddJamUserPayload): Promise<{ message: string }> => {
        const response = await axios.post(`${apiUrl}/jam/${data.jam_id}/add-user`, { email: data.email });
        return response.data as {message: string};
    },

    removeUser: async (payload: RemoveJamUserPayload) => {
        const response = await axios({
            method: 'delete',
            url: `${apiUrl}/jam/removeuser`,
            data: payload
        });
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