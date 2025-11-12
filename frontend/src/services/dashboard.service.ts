import axios from "axios";
import type { RadarChartDataItem, LineChartDataItem, TagCloudDataItem } from "../types/dashboard.types";
const apiUrl = import.meta.env.VITE_API_URL;


const dashboardService = {
    getRadarChartData: async (user_id: string): Promise<RadarChartDataItem[]> => {
        const response = await axios.get<RadarChartDataItem[]>(`${apiUrl}/dashboard/radarChartData`, { params: { user_id } });
        return response.data;
    },

    getLineChartData: async (): Promise<LineChartDataItem[]> => {
        const response = await axios.get<LineChartDataItem[]>(`${apiUrl}/dashboard/lineChartData`);
        return response.data;
    },

    getTagCloudData: async (): Promise<TagCloudDataItem[]> => {
        const response = await axios.get<TagCloudDataItem[]>(`${apiUrl}/dashboard/tagCloudData`);
        return response.data;
    },

    getBarChartData: async (): Promise<LineChartDataItem[]> => {
        const response = await axios.get<LineChartDataItem[]>(`${apiUrl}/dashboard/barChartData`);
        return response.data;
    }
};

export default dashboardService;

