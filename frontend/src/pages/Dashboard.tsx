import {BarChart, Bar, Rectangle, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, YAxis, CartesianGrid, XAxis, Tooltip, LineChart, Legend, Line } from 'recharts';
import { TagCloud } from 'react-tagcloud';
import { useState, useEffect } from 'react';
import dashboardService from '../services/dashboard.service';
import type { RadarChartDataItem, LineChartDataItem, TagCloudDataItem, BarChartDataItem } from '../types/dashboard.types';
import { GlobalConstants } from '../assets/GlobalConstants';

const DashboardPage = () => {
  const [radarChartData, setRadarChartData] = useState<RadarChartDataItem[]>([]);
  const [lineChartData, setLineChartData] = useState<LineChartDataItem[]>([]);
  const [barChartData, setBarChartData] = useState<BarChartDataItem[]>([]);
  const [tagCloudData, setTagCloudData] = useState<TagCloudDataItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [radarData, lineData, tagData, barData] = await Promise.all([
          dashboardService.getRadarChartData(GlobalConstants.USER_ID),
          dashboardService.getLineChartData(GlobalConstants.USER_ID),
          dashboardService.getTagCloudData(GlobalConstants.USER_ID),
          dashboardService.getBarChartData(GlobalConstants.USER_ID)
        ]);
        
        setRadarChartData(radarData);
        setLineChartData(lineData);
        setTagCloudData(tagData);
        setBarChartData(barData);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
    fetchData();
  }, []);
  return (
    <>
    <div className="flex flex-row items-start justify-between">
            
    <div className="flex flex-col items-center justify-start w-full max-w-[500px] h-[70vh]">
    <h2 className="text-2xl font-bold mb-4">Skills</h2>
    <RadarChart
      style={{ width: '100%', height: '100%', maxWidth: '500px', maxHeight: '70vh', aspectRatio: 1 }}
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
    <div className="flex flex-col items-center justify-start w-full max-w-[700px] h-[70vh]">
    <h2 className="text-2xl font-bold mb-4">Recently solved problems</h2>
    <LineChart
      style={{ width: '100%', maxWidth: '700px', height: '100%', maxHeight: '70vh', aspectRatio: 1.618 }}
      responsive
      data = {lineChartData}
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
      <Line type="monotone" dataKey="solved" stroke="#8884d8" activeDot={{ r: 8 }} />

    </LineChart>
    </div>
   
    </div>

    <div className="flex flex-row items-start justify-between">
    <div className="flex flex-col items-center justify-start w-full max-w-[700px] h-[70vh]">
    <h2 className="text-2xl font-bold mb-4">Solved topics</h2>
    <TagCloud
    className="w-full h-full"
    minSize={12}
    maxSize={35}
    tags={tagCloudData}
  />
    </div>

    <div className="flex flex-col items-center justify-start w-full max-w-[700px] h-[70vh]">
    <h2 className="text-2xl font-bold mb-4">Least solved topics</h2>
    <BarChart
      style={{ width: '100%', maxWidth: '700px', maxHeight: '70vh', aspectRatio: 1.618 }}
      responsive
      data={barChartData}
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
      <Bar dataKey="value" fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="purple" />} />
    </BarChart>
    </div>
    </div>
   
    </>
  );
};

export default DashboardPage;