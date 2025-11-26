import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TimelineChart = ({ data, selectedRange }) => {
  const chartData = [
    { month: 'Nov 2024', laptops: 12, desktops: 8, monitors: 15, servers: 3, networking: 5, total: 43 },
    { month: 'Dec 2024', laptops: 18, desktops: 12, monitors: 22, servers: 2, networking: 7, total: 61 },
    { month: 'Jan 2025', laptops: 25, desktops: 15, monitors: 18, servers: 5, networking: 9, total: 72 },
    { month: 'Feb 2025', laptops: 14, desktops: 9, monitors: 12, servers: 1, networking: 4, total: 40 },
    { month: 'Mar 2025', laptops: 22, desktops: 18, monitors: 25, servers: 4, networking: 8, total: 77 },
    { month: 'Apr 2025', laptops: 16, desktops: 11, monitors: 14, servers: 2, networking: 6, total: 49 }
  ];

  const categoryColors = {
    laptops: '#00529B',
    desktops: '#3B82F6',
    monitors: '#10B981',
    servers: '#F59E0B',
    networking: '#EF4444'
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      const total = payload?.reduce((sum, entry) => sum + entry?.value, 0);
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-modal">
          <p className="font-medium text-popover-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color }}>
              {`${entry?.dataKey}: ${entry?.value} assets`}
            </p>
          ))}
          <div className="border-t border-border mt-2 pt-2">
            <p className="text-sm font-medium text-popover-foreground">
              Total: {total} assets
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Asset Replacement Timeline</h3>
          <p className="text-sm text-muted-foreground">
            Scheduled replacements by category over the selected period
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-foreground">293</div>
          <div className="text-sm text-muted-foreground">Total Assets</div>
        </div>
      </div>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="month" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="laptops" name="Laptops" fill={categoryColors?.laptops} />
            <Bar dataKey="desktops" name="Desktops" fill={categoryColors?.desktops} />
            <Bar dataKey="monitors" name="Monitors" fill={categoryColors?.monitors} />
            <Bar dataKey="servers" name="Servers" fill={categoryColors?.servers} />
            <Bar dataKey="networking" name="Networking" fill={categoryColors?.networking} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TimelineChart;