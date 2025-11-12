interface RadarChartDataItem {
    subject: string;
    A: number;
    fullMark: number;
}

interface LineChartDataItem {
    name: string;
    solved: number;
}

interface TagCloudDataItem {
    value: string;
    count: number;
}

interface BarChartDataItem {
    name: string;
    value: number;
}

export type { RadarChartDataItem, LineChartDataItem, TagCloudDataItem, BarChartDataItem };