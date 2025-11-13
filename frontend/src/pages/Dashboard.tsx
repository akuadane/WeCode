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
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col items-center">
      <div className="grid grid-cols-2 gap-6 w-full max-w-[1400px]">
        {/* Top Left - Skills */}
        <div className="flex flex-col items-center justify-start bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Skills</h2>
          <RadarChart
            style={{ width: '100%', height: '100%', aspectRatio: 1 }}
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
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 12 }} />
            <PolarRadiusAxis tick={{ fill: '#9ca3af', fontSize: 10 }} />
            <Radar name="Skills" dataKey="A" stroke={GlobalConstants.BLUE} fill={GlobalConstants.BLUE} fillOpacity={0.6} />
          </RadarChart>
        </div>
        
        {/* Top Right - Recently solved problems */}
        <div className="flex flex-col items-center justify-start bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Recently solved problems</h2>
          <LineChart
            style={{ width: '100%', height: '100%', aspectRatio: 1.618 }}
            responsive
            data={lineChartData}
            margin={{
              top: 5,
              right: 20,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 11 }} />
            <YAxis width="auto" tick={{ fill: '#6b7280', fontSize: 11 }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb', 
                borderRadius: '6px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }} 
            />
            <Legend wrapperStyle={{ fontSize: '12px', color: '#6b7280' }} />
            <Line 
              type="monotone" 
              dataKey="solved" 
              stroke={GlobalConstants.BLUE} 
              strokeWidth={2}
              activeDot={{ r: 6, fill: GlobalConstants.BLUE }} 
            />
          </LineChart>
        </div>

        {/* Bottom Left - Solved topics */}
        <div className="flex flex-col items-center justify-start bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Solved topics</h2>
          <div className="w-full h-full flex items-center justify-center">
            <TagCloud
              className="w-full h-full"
              minSize={12}
              maxSize={35}
              tags={tagCloudData}
            />
          </div>
        </div>

        {/* Bottom Right - Least solved topics */}
        <div className="flex flex-col items-center justify-start bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Least solved topics</h2>
          <BarChart
            style={{ width: '100%', height: '100%', aspectRatio: 1.618 }}
            responsive
            data={barChartData}
            margin={{
              top: 5,
              right: 20,
              left: 0,
              bottom: 50,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              height={60} 
              tick={{ fill: '#6b7280', fontSize: 11 }} 
            />
            <YAxis width="auto" tick={{ fill: '#6b7280', fontSize: 11 }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb', 
                borderRadius: '6px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }} 
            />
            <Legend wrapperStyle={{ fontSize: '12px', color: '#6b7280' }} />
            <Bar 
              dataKey="value" 
              fill={GlobalConstants.GREEN} 
              radius={[4, 4, 0, 0]}
              activeBar={<Rectangle fill={GlobalConstants.BLUE} stroke={GlobalConstants.BLUE} strokeWidth={1} />} 
            />
          </BarChart>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;