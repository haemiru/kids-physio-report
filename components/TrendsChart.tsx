
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { SurvivalRecord } from '../types';

interface TrendsChartProps {
  records: SurvivalRecord[];
}

export const TrendsChart: React.FC<TrendsChartProps> = ({ records }) => {
  const chartData = records.map(r => ({
    date: r.date.split('-').slice(1).join('/'),
    resp: r.respiratoryRate,
    exercise: r.exerciseMinutes,
    sleep: r.sleepHours
  }));

  return (
    <div className="space-y-8 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      <div className="h-64 w-full">
        <h3 className="text-sm font-bold text-slate-500 mb-4 uppercase tracking-wider">호흡수 및 운동량 추이</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Legend iconType="circle" />
            <Line 
              type="monotone" 
              dataKey="resp" 
              name="호흡수 (BPM)" 
              stroke="#ef4444" 
              strokeWidth={3} 
              dot={{ r: 4, fill: '#ef4444' }}
              activeDot={{ r: 6 }} 
            />
            <Line 
              type="monotone" 
              dataKey="exercise" 
              name="운동량 (분)" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ r: 4, fill: '#3b82f6' }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="h-48 w-full">
        <h3 className="text-sm font-bold text-slate-500 mb-4 uppercase tracking-wider">수면 시간 분석</h3>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
            <Tooltip contentStyle={{ borderRadius: '12px' }} />
            <Area type="monotone" dataKey="sleep" name="수면(시간)" stroke="#f59e0b" fill="#fef3c7" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
