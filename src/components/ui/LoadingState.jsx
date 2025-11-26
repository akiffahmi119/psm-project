import React from 'react';

const LoadingSkeleton = ({ className = "", variant = "default" }) => {
  const getSkeletonClass = () => {
    const baseClass = "animate-pulse bg-muted rounded";
    
    switch (variant) {
      case 'text':
        return `${baseClass} h-4`;
      case 'title':
        return `${baseClass} h-6`;
      case 'avatar':
        return `${baseClass} h-10 w-10 rounded-full`;
      case 'button':
        return `${baseClass} h-10 w-24`;
      case 'card':
        return `${baseClass} h-32`;
      case 'table-row':
        return `${baseClass} h-12`;
      default:
        return `${baseClass} h-4`;
    }
  };

  return <div className={`${getSkeletonClass()} ${className}`} />;
};

const TableSkeleton = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="space-y-3">
      {/* Table Header */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns })?.map((_, index) => (
          <LoadingSkeleton key={`header-${index}`} variant="text" className="h-5" />
        ))}
      </div>
      {/* Table Rows */}
      {Array.from({ length: rows })?.map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns })?.map((_, colIndex) => (
            <LoadingSkeleton key={`cell-${rowIndex}-${colIndex}`} variant="table-row" />
          ))}
        </div>
      ))}
    </div>
  );
};

const CardSkeleton = ({ showAvatar = false, showButton = false }) => {
  return (
    <div className="p-6 bg-card border border-border rounded-lg space-y-4">
      {showAvatar && (
        <div className="flex items-center space-x-3">
          <LoadingSkeleton variant="avatar" />
          <div className="space-y-2 flex-1">
            <LoadingSkeleton variant="title" className="w-1/3" />
            <LoadingSkeleton variant="text" className="w-1/2" />
          </div>
        </div>
      )}
      
      <div className="space-y-3">
        <LoadingSkeleton variant="title" className="w-3/4" />
        <LoadingSkeleton variant="text" className="w-full" />
        <LoadingSkeleton variant="text" className="w-5/6" />
        <LoadingSkeleton variant="text" className="w-2/3" />
      </div>
      
      {showButton && (
        <div className="flex space-x-2 pt-2">
          <LoadingSkeleton variant="button" />
          <LoadingSkeleton variant="button" />
        </div>
      )}
    </div>
  );
};

const DashboardSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 })?.map((_, index) => (
          <div key={`stat-${index}`} className="p-6 bg-card border border-border rounded-lg">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <LoadingSkeleton variant="text" className="w-20" />
                <LoadingSkeleton variant="title" className="w-16" />
              </div>
              <LoadingSkeleton className="h-8 w-8 rounded" />
            </div>
          </div>
        ))}
      </div>
      {/* Chart Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CardSkeleton />
        <CardSkeleton />
      </div>
      {/* Table */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="space-y-4">
          <LoadingSkeleton variant="title" className="w-1/4" />
          <TableSkeleton rows={8} columns={5} />
        </div>
      </div>
    </div>
  );
};

const ListSkeleton = ({ items = 10 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: items })?.map((_, index) => (
        <div key={`list-item-${index}`} className="flex items-center space-x-4 p-4 bg-card border border-border rounded-lg">
          <LoadingSkeleton variant="avatar" />
          <div className="flex-1 space-y-2">
            <LoadingSkeleton variant="title" className="w-1/3" />
            <LoadingSkeleton variant="text" className="w-1/2" />
            <LoadingSkeleton variant="text" className="w-1/4" />
          </div>
          <div className="space-y-2">
            <LoadingSkeleton variant="button" className="w-20" />
          </div>
        </div>
      ))}
    </div>
  );
};

const FormSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 6 })?.map((_, index) => (
          <div key={`field-${index}`} className="space-y-2">
            <LoadingSkeleton variant="text" className="w-1/4 h-4" />
            <LoadingSkeleton className="w-full h-10 rounded-md" />
          </div>
        ))}
      </div>
      <div className="flex justify-end space-x-3 pt-6">
        <LoadingSkeleton variant="button" className="w-20" />
        <LoadingSkeleton variant="button" className="w-20" />
      </div>
    </div>
  );
};

const LoadingSpinner = ({ size = 'default', className = "" }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    default: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  return (<div className={`animate-spin rounded-full border-2 border-muted border-t-primary ${sizeClasses?.[size]} ${className}`} />);
};

const LoadingOverlay = ({ message = "Loading..." }) => {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-300 flex items-center justify-center">
      <div className="bg-card border border-border rounded-lg p-6 shadow-modal">
        <div className="flex items-center space-x-3">
          <LoadingSpinner size="lg" />
          <span className="text-foreground font-medium">{message}</span>
        </div>
      </div>
    </div>
  );
};

export {
  LoadingSkeleton,
  TableSkeleton,
  CardSkeleton,
  DashboardSkeleton,
  ListSkeleton,
  FormSkeleton,
  LoadingSpinner,
  LoadingOverlay
};

export default LoadingSkeleton;