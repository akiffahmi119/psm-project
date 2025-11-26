import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import Icon from '../../../components/AppIcon';

const BudgetSummary = ({ dateRange }) => {
  const budgetData = [
    { category: 'Laptops', amount: 245000, percentage: 35, color: '#00529B' },
    { category: 'Desktops', amount: 180000, percentage: 26, color: '#3B82F6' },
    { category: 'Monitors', amount: 125000, percentage: 18, color: '#10B981' },
    { category: 'Servers', amount: 95000, percentage: 14, color: '#F59E0B' },
    { category: 'Networking', amount: 55000, percentage: 7, color: '#EF4444' }
  ];

  const totalBudget = budgetData?.reduce((sum, item) => sum + item?.amount, 0);
  const monthlyAverage = Math.round(totalBudget / 6);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(amount);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-modal">
          <p className="font-medium text-popover-foreground">{data?.category}</p>
          <p className="text-sm text-muted-foreground">
            {formatCurrency(data?.amount)} ({data?.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Budget Overview Cards */}
      <div className="space-y-4">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Budget Impact Summary</h3>
            <Icon name="DollarSign" size={20} className="text-primary" />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <div className="text-sm text-muted-foreground">Total Replacement Cost</div>
                <div className="text-2xl font-bold text-foreground">{formatCurrency(totalBudget)}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Monthly Average</div>
                <div className="text-lg font-semibold text-foreground">{formatCurrency(monthlyAverage)}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="TrendingDown" size={16} className="text-success" />
                  <span className="text-sm font-medium text-success">Under Budget</span>
                </div>
                <div className="text-lg font-bold text-success">{formatCurrency(45000)}</div>
                <div className="text-xs text-success/80">6.4% savings</div>
              </div>

              <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="AlertTriangle" size={16} className="text-warning" />
                  <span className="text-sm font-medium text-warning">High Priority</span>
                </div>
                <div className="text-lg font-bold text-warning">47</div>
                <div className="text-xs text-warning/80">Critical replacements</div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h4 className="text-md font-semibold text-foreground mb-4">Budget by Category</h4>
          <div className="space-y-3">
            {budgetData?.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item?.color }}
                  />
                  <span className="text-sm text-foreground">{item?.category}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-foreground">{formatCurrency(item?.amount)}</div>
                  <div className="text-xs text-muted-foreground">{item?.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Pie Chart */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h4 className="text-md font-semibold text-foreground mb-4">Budget Distribution</h4>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={budgetData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={2}
                dataKey="amount"
              >
                {budgetData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry?.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default BudgetSummary;