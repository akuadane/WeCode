interface RadarChartDataItem {
    subject: string;
    A: number;
    fullMark: number;
}

interface LineChartDataItem {
    name: string;
    uv: number;
    pv: number;
    amt: number;
}

interface TagCloudDataItem {
    value: string;
    count: number;
}

export type { RadarChartDataItem, LineChartDataItem, TagCloudDataItem };