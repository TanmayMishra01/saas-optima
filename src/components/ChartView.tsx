import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Subscription } from '../types';

interface ChartViewProps {
  subscriptions: Subscription[];
  theme?: 'slate' | 'midnight' | 'nordic' | 'warm' | 'brutalist';
}

const CATEGORY_COLORS: { [key: string]: string } = {
  Infrastructure: '#2563eb', // Blue
  Communication: '#0ea5e9', // Sky blue
  Collaboration: '#10b981', // Emerald
  'Sales & Marketing': '#f59e0b', // Amber
  Productivity: '#8b5cf6', // Purple
  Security: '#ec4899', // Pink
  Analytics: '#14b8a6', // Teal
  Other: '#64748b', // Slate
};

export default function ChartView({ subscriptions, theme = 'slate' }: ChartViewProps) {
  // Aggregate category-wise monthly spend
  const categoryDataMap = subscriptions.reduce((acc, sub) => {
    const key = sub.category;
    // Normalize costs to a monthly standard for fair comparison
    const monthlyCost = sub.billing_cycle === 'annual' ? Math.round(sub.cost / 12) : sub.cost;
    acc[key] = (acc[key] || 0) + monthlyCost;
    return acc;
  }, {} as { [key: string]: number });

  const categoryChartData = Object.entries(categoryDataMap).map(([name, value]) => ({
    name,
    value,
    color: CATEGORY_COLORS[name] || '#64748b',
  })).sort((a, b) => b.value - a.value);

  // Aggregate billing cycle distribution
  const cycleDataMap = subscriptions.reduce((acc, sub) => {
    const key = sub.billing_cycle === 'annual' ? 'Annual Commitments' : 'Monthly Pay-As-You-Go';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  const cycleChartData = Object.entries(cycleDataMap).map(([name, value]) => ({
    name,
    value,
  }));

  const CYCLE_COLORS = ['#10b981', '#3b82f6'];

  // Custom Tooltip formatter
  const formatCurrencyTooltip = (value: any) => {
    return [`$${value.toLocaleString()}/mo`, 'Spend'];
  };

  const layoutStyles = {
    slate: {
      card: 'bg-white border-slate-200 shadow-sm rounded-xl',
      title: 'text-slate-900',
      sub: 'text-slate-500',
      text: '#64748b',
      grid: '#e2e8f0',
      divider: 'border-slate-100',
      innerVal: 'text-slate-800',
    },
    midnight: {
      card: 'bg-[#0c1222] border-slate-800/80 shadow-md shadow-black/40 rounded-xl',
      title: 'text-white',
      sub: 'text-slate-400',
      text: '#94a3b8',
      grid: '#1e293b',
      divider: 'border-[#1e293b]/60',
      innerVal: 'text-white',
    },
    nordic: {
      card: 'bg-white border-blue-100 shadow-sm rounded-xl',
      title: 'text-[#1e293b]',
      sub: 'text-slate-500',
      text: '#64748b',
      grid: '#e2e8f0',
      divider: 'border-slate-100',
      innerVal: 'text-slate-800',
    },
    warm: {
      card: 'bg-[#fbf9f5] border-[#ebdcd0] shadow-xs rounded-xl',
      title: 'text-[#2e2620]',
      sub: 'text-[#7a6d61]',
      text: '#7a6d61',
      grid: '#ebdcd0',
      divider: 'border-[#ebdcd0]/40',
      innerVal: 'text-[#2e2620]',
    },
    brutalist: {
      card: 'bg-white border-2.5 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all',
      title: 'text-black font-mono font-black uppercase tracking-tight',
      sub: 'text-zinc-700 font-mono text-xs',
      text: '#000000',
      grid: '#000000',
      divider: 'border-t-2 border-black',
      innerVal: 'text-black font-black',
    }
  }[theme];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Category Spend Distribution */}
      <div className={`border p-6 transition-all duration-200 ${layoutStyles.card}`}>
        <div className="mb-4">
          <h3 className={`text-base font-bold font-sans ${layoutStyles.title}`}>{theme === 'brutalist' ? 'Monthly Spend by Category' : 'Monthly Spend by Category'}</h3>
          <p className={`text-xs font-sans mt-0.5 ${layoutStyles.sub}`}>Normalized comparison of software categories (Annual costs divided by 12)</p>
        </div>
        <div className="h-72 w-full">
          {categoryChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryChartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray={theme === 'brutalist' ? '0' : '3 3'} vertical={false} stroke={layoutStyles.grid} />
                <XAxis
                  dataKey="name"
                  tickLine={theme === 'brutalist'}
                  axisLine={theme === 'brutalist'}
                  tick={{ fill: layoutStyles.text, fontSize: 10, fontFamily: theme === 'brutalist' ? 'monospace' : 'sans-serif', fontWeight: theme === 'brutalist' ? 'bold' : 'normal' }}
                />
                <YAxis
                  tickLine={theme === 'brutalist'}
                  axisLine={theme === 'brutalist'}
                  tick={{ fill: layoutStyles.text, fontSize: 10, fontFamily: theme === 'brutalist' ? 'monospace' : 'sans-serif' }}
                  tickFormatter={(val) => `$${val}`}
                />
                <Tooltip
                  cursor={{ fill: theme === 'midnight' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                  contentStyle={{
                    backgroundColor: theme === 'midnight' ? '#0f172a' : '#fff',
                    borderColor: theme === 'brutalist' ? '#000' : theme === 'midnight' ? '#1e293b' : '#cbd5e1',
                    borderRadius: theme === 'brutalist' ? '0px' : '8px',
                    borderWidth: theme === 'brutalist' ? '2px' : '1px',
                    color: theme === 'midnight' ? '#fff' : '#000',
                    fontFamily: theme === 'brutalist' ? 'monospace' : 'sans-serif',
                    fontSize: '12px',
                    boxShadow: theme === 'brutalist' ? '2px 2px 0px 0px rgba(0,0,0,1)' : 'none',
                  }}
                  formatter={formatCurrencyTooltip}
                />
                <Bar dataKey="value" radius={theme === 'brutalist' ? [0, 0, 0, 0] : [4, 4, 0, 0]}>
                  {categoryChartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color} 
                      stroke={theme === 'brutalist' ? '#000' : 'none'}
                      strokeWidth={theme === 'brutalist' ? 1.5 : 0}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className={`h-full flex items-center justify-center border border-dashed rounded-lg ${theme === 'midnight' ? 'border-slate-800' : 'border-slate-200'}`}>
              <p className={`text-sm font-sans ${layoutStyles.sub}`}>No data available for category chart rendering</p>
            </div>
          )}
        </div>
      </div>

      {/* Cycle Allocation Doughnut Chart */}
      <div className={`border p-6 transition-all duration-200 flex flex-col justify-between ${layoutStyles.card}`}>
        <div>
          <h3 className={`text-base font-bold font-sans ${layoutStyles.title}`}>Contract Type Split</h3>
          <p className={`text-xs font-sans mt-0.5 ${layoutStyles.sub}`}>Ratio of monthly contracts versus annual commitments</p>
        </div>
        <div className="h-48 w-full relative flex items-center justify-center my-4">
          {subscriptions.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={cycleChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {cycleChartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={CYCLE_COLORS[index % CYCLE_COLORS.length]} 
                        stroke={theme === 'brutalist' ? '#000' : 'none'}
                        strokeWidth={theme === 'brutalist' ? 1.5 : 0}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme === 'midnight' ? '#0f172a' : '#fff',
                      borderColor: theme === 'brutalist' ? '#000' : theme === 'midnight' ? '#1e293b' : '#cbd5e1',
                      borderRadius: theme === 'brutalist' ? '0px' : '8px',
                      color: theme === 'midnight' ? '#fff' : '#000',
                      fontSize: '11px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className={`text-2xl font-bold font-sans ${layoutStyles.innerVal}`}>{subscriptions.length}</span>
                <span className={`text-[10px] uppercase tracking-widest font-mono ${layoutStyles.sub}`}>Tools</span>
              </div>
            </>
          ) : (
            <div className={`h-full flex items-center justify-center border border-dashed rounded-lg w-full ${theme === 'midnight' ? 'border-slate-800' : 'border-slate-200'}`}>
              <p className={`text-sm font-sans ${layoutStyles.sub}`}>No data</p>
            </div>
          )}
        </div>

        {/* Custom Legend */}
        <div className={`space-y-2 pt-2 border-t ${layoutStyles.divider}`}>
          {cycleChartData.map((entry, index) => {
            const total = cycleChartData.reduce((sum, item) => sum + item.value, 0);
            const percentage = total > 0 ? Math.round((entry.value / total) * 100) : 0;
            return (
              <div key={entry.name} className="flex items-center justify-between text-xs">
                <div className={`flex items-center gap-2 font-medium ${theme === 'midnight' ? 'text-slate-400' : theme === 'warm' ? 'text-[#7a6d61]' : 'text-slate-600'}`}>
                  <span
                    className={`h-2.5 w-2.5 rounded-full inline-block ${theme === 'brutalist' ? 'rounded-none border border-black' : ''}`}
                    style={{ backgroundColor: CYCLE_COLORS[index % CYCLE_COLORS.length] }}
                  ></span>
                  <span className={theme === 'brutalist' ? 'font-mono text-[10px] uppercase font-bold' : ''}>{entry.name}</span>
                </div>
                <span className={`font-mono font-semibold ${theme === 'midnight' ? 'text-white' : theme === 'warm' ? 'text-[#2e2620]' : 'text-slate-900'}`}>{percentage}% ({entry.value})</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
