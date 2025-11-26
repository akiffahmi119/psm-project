import React from 'react';
import AppIcon from '../../../components/AppIcon';
import { cn } from '../../../utils/cn';

const StatsCards = ({ data }) => {
  const getColorClasses = (color) => {
    const colorMap = {
      primary: 'bg-primary/10 text-primary',
      success: 'bg-success/10 text-success',
      warning: 'bg-warning/10 text-warning',
      error: 'bg-error/10 text-error',
      secondary: 'bg-secondary/10 text-secondary'
    };
    return colorMap?.[color] || colorMap?.primary;
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up':
        return 'text-success';
      case 'down':
        return 'text-error';
      case 'stable':
        return 'text-muted-foreground';
      default:
        return 'text-muted-foreground';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return 'TrendingUp';
      case 'down':
        return 'TrendingDown';
      case 'stable':
        return 'Minus';
      default:
        return 'Minus';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {data?.map((stat, index) => (
        <div
          key={index}
          className="bg-card rounded-lg border border-border p-6 transition-all duration-200 hover:shadow-lg hover:border-primary/20"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={cn(
              'inline-flex items-center justify-center w-12 h-12 rounded-lg',
              getColorClasses(stat?.color)
            )}>
              <AppIcon name={stat?.icon} size={24} />
            </div>
            
            <div className={cn(
              'flex items-center gap-1 text-sm font-medium',
              getTrendColor(stat?.trend)
            )}>
              <AppIcon name={getTrendIcon(stat?.trend)} size={16} />
              <span>{stat?.trendValue}</span>
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-foreground">{stat?.value}</h3>
            <p className="text-sm font-medium text-foreground">{stat?.title}</p>
            <p className="text-xs text-muted-foreground">{stat?.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;