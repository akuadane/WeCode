import {BarChart, Bar, Rectangle, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, YAxis, CartesianGrid, XAxis, Tooltip, LineChart, Legend, Line } from 'recharts';
import { TagCloud } from 'react-tagcloud';
import { useState, useEffect } from 'react';
import dashboardService from '../services/dashboard.service';
import type { RadarChartDataItem, LineChartDataItem, TagCloudDataItem } from '../types/dashboard.types';

const DashboardPage = () => {
  const [radarChartData, setRadarChartData] = useState<RadarChartDataItem[]>([]);
  const [lineChartData, setLineChartData] = useState<LineChartDataItem[]>([]);
  const [tagCloudData, setTagCloudData] = useState<TagCloudDataItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [radarData, lineData, tagData] = await Promise.all([
          dashboardService.getRadarChartData("673210a81f9a3e2d88f0b001"),
          dashboardService.getLineChartData(),
          dashboardService.getTagCloudData()
        ]);
        setRadarChartData(radarData);
        setLineChartData(lineData);
        setTagCloudData(tagData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
    fetchData();
  }, []);
  return (
    <>
    <div className="flex flex-row items-center justify-between">
            
    <div className="flex flex-col items-center justify-center w-full max-w-[500px] max-h-[70vh]">
    <h2 className="text-2xl font-bold">Subjects</h2>
    <RadarChart
      style={{ width: '100%', height: '100%', maxWidth: '500px', maxHeight: '80vh', aspectRatio: 1 }}
      responsive
      outerRadius="80%"
      data={radarChartData}
      margin={{
        top: 20,
        left: 20,
        right: 20,
        bottom: 20,
      }}
    >
      <PolarGrid />
      <PolarAngleAxis dataKey="subject" />
      <PolarRadiusAxis />
      <Radar name="Mike" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
    </RadarChart>
    </div>
    <LineChart
      style={{ width: '100%', maxWidth: '700px', height: '100%', maxHeight: '70vh', aspectRatio: 1.618 }}
      responsive
      data={lineChartData}
      margin={{
        top: 5,
        right: 0,
        left: 0,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis width="auto" />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
      <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
    </LineChart>
   
    </div>

    <div className="flex flex-row items-center justify-between">
    <TagCloud
    className="w-full max-w-[500px] max-h-[70vh]"
    minSize={12}
    maxSize={35}
    tags={tagCloudData}
  />

<BarChart
      style={{ width: '100%', maxWidth: '700px', maxHeight: '70vh', aspectRatio: 1.618 }}
      responsive
      data={lineChartData}
      margin={{
        top: 5,
        right: 0,
        left: 0,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis width="auto" />
      <Tooltip />
      <Legend />
      <Bar dataKey="pv" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
      <Bar dataKey="uv" fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="purple" />} />
    </BarChart>
    </div>
   
    </>
  );
};

export default DashboardPage;