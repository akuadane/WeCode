import axios from "axios";
import type { RadarChartDataItem, LineChartDataItem, TagCloudDataItem, BarChartDataItem } from "../types/dashboard.types";
const apiUrl = import.meta.env.VITE_API_URL;


const dashboardService = {
    getRadarChartData: async (user_id: string): Promise<RadarChartDataItem[]> => {
        const response = await axios.get<RadarChartDataItem[]>(`${apiUrl}/dashboard/radarChartData`, { params: { user_id } });
        return response.data;
    },

    getLineChartData: async (user_id: string): Promise<LineChartDataItem[]> => {
        const response = await axios.get<LineChartDataItem[]>(`${apiUrl}/dashboard/lineChartData`, { params: { user_id } });
        return response.data;
    },

    getTagCloudData: async (user_id: string): Promise<TagCloudDataItem[]> => {
        const response = await axios.get<TagCloudDataItem[]>(`${apiUrl}/dashboard/tagCloudData`, { params: { user_id } });
        return response.data;
    },

    getBarChartData: async (user_id: string): Promise<BarChartDataItem[]> => {
        const response = await axios.get<BarChartDataItem[]>(`${apiUrl}/dashboard/barChartData`, { params: { user_id } });
        console.log("barChartData from service", response.data);
        return response.data;
    }
};

export default dashboardService;

