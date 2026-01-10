import React from 'react';
import Icon from '../../../components/AppIcon';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const RecentActivityFeed = ({ activities }) => {
  const navigate = useNavigate(); // Initialize useNavigate
  const getActivityIcon = (type) => {
    switch (type) {
      case 'asset_added':
        return 'Plus';
      case 'asset_updated':
        return 'Edit';
      case 'asset_checked_out':
        return 'ArrowRight';
      case 'asset_checked_in':
        return 'ArrowLeft';
      case 'maintenance_logged':
        return 'Wrench';
      case 'asset_retired':
        return 'Archive';
      default:
        return 'Activity';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'asset_added':
        return 'text-success';
      case 'asset_updated':
        return 'text-accent';
      case 'asset_checked_out':
        return 'text-warning';
      case 'asset_checked_in':
        return 'text-success';
      case 'maintenance_logged':
        return 'text-primary';
      case 'asset_retired':
        return 'text-muted-foreground';
      default:
        return 'text-foreground';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - activityTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
        <p className="text-sm text-muted-foreground">Latest system actions and updates</p>
      </div>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {activities?.map((activity) => (
          <div key={activity?.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
            <div className={`p-2 rounded-full bg-muted ${getActivityColor(activity?.type)}`}>
              <Icon name={getActivityIcon(activity?.type)} size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{activity?.description}</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xs text-muted-foreground">by {activity?.user}</span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">{formatTimeAgo(activity?.timestamp)}</span>
              </div>
              {activity?.assetId && (
                <p className="text-xs text-accent mt-1">Asset ID: {activity?.assetId}</p>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <button 
          onClick={() => navigate('/all-activities')} // Add onClick handler
          className="text-sm text-accent hover:text-accent/80 font-medium transition-colors"
        >
          View all activity →
        </button>
      </div>
    </div>
  );
};

export default RecentActivityFeed;