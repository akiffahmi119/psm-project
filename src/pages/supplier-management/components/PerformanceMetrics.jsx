import React from 'react';
import { Building2, Star, DollarSign, TrendingUp, Award, AlertTriangle } from 'lucide-react';

const PerformanceMetrics = ({ suppliers }) => {
  const calculateMetrics = () => {
    if (!suppliers || suppliers?.length === 0) {
      return {
        totalSuppliers: 0,
        activeSuppliers: 0,
        averageRating: 0,
        totalValue: 0,
        preferredVendors: 0,
        expiringContracts: 0
      };
    }

    const totalSuppliers = suppliers?.length;
    const activeSuppliers = suppliers?.filter(s => s?.status === 'active')?.length;
    
    const avgRating = suppliers?.reduce((sum, s) => sum + (s?.rating || 0), 0) / totalSuppliers;
    
    const totalValue = suppliers?.reduce((sum, s) => {
      const value = s?.totalValue?.replace(/[\$,]/g, '') || '0';
      return sum + parseFloat(value);
    }, 0);
    
    const preferredVendors = suppliers?.filter(s => s?.preferredVendor)?.length;
    
    // Calculate contracts expiring within 90 days
    const today = new Date();
    const ninetyDaysFromNow = new Date(today?.getTime() + (90 * 24 * 60 * 60 * 1000));
    const expiringContracts = suppliers?.filter(s => {
      if (!s?.contractEnd) return false;
      const endDate = new Date(s?.contractEnd);
      return endDate >= today && endDate <= ninetyDaysFromNow;
    })?.length;

    return {
      totalSuppliers,
      activeSuppliers,
      averageRating: avgRating,
      totalValue,
      preferredVendors,
      expiringContracts
    };
  };

  const metrics = calculateMetrics();

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(value);
  };

  const formatRating = (rating) => {
    return rating?.toFixed(1);
  };

  const getActiveSupplierPercentage = () => {
    if (metrics?.totalSuppliers === 0) return 0;
    return Math?.round((metrics?.activeSuppliers / metrics?.totalSuppliers) * 100);
  };

  const metricsData = [
    {
      title: 'Total Suppliers',
      value: metrics?.totalSuppliers?.toString(),
      subtitle: `${metrics?.activeSuppliers} active`,
      icon: Building2,
      color: 'primary',
      trend: null
    },
    {
      title: 'Average Rating',
      value: formatRating(metrics?.averageRating),
      subtitle: 'Supplier performance',
      icon: Star,
      color: 'warning',
      trend: null
    },
    {
      title: 'Total Contract Value',
      value: formatCurrency(metrics?.totalValue),
      subtitle: 'Combined portfolio',
      icon: DollarSign,
      color: 'success',
      trend: null
    },
    {
      title: 'Preferred Vendors',
      value: metrics?.preferredVendors?.toString(),
      subtitle: `${Math?.round((metrics?.preferredVendors / (metrics?.totalSuppliers || 1)) * 100)}% of total`,
      icon: Award,
      color: 'primary',
      trend: null
    },
    {
      title: 'Active Rate',
      value: `${getActiveSupplierPercentage()}%`,
      subtitle: 'Supplier availability',
      icon: TrendingUp,
      color: 'success',
      trend: null
    },
    {
      title: 'Contracts Expiring',
      value: metrics?.expiringContracts?.toString(),
      subtitle: 'Within 90 days',
      icon: AlertTriangle,
      color: metrics?.expiringContracts > 0 ? 'error' : 'muted',
      trend: null
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      primary: {
        bg: 'bg-primary/10',
        text: 'text-primary',
        icon: 'text-primary'
      },
      success: {
        bg: 'bg-success/10',
        text: 'text-success',
        icon: 'text-success'
      },
      warning: {
        bg: 'bg-warning/10',
        text: 'text-warning',
        icon: 'text-warning'
      },
      error: {
        bg: 'bg-destructive/10',
        text: 'text-destructive',
        icon: 'text-destructive'
      },
      muted: {
        bg: 'bg-muted',
        text: 'text-muted-foreground',
        icon: 'text-muted-foreground'
      }
    };
    return colorMap?.[color] || colorMap?.muted;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {metricsData?.map((metric, index) => {
        const colors = getColorClasses(metric?.color);
        const IconComponent = metric?.icon;
        
        return (
          <div key={index} className="bg-card border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors?.bg}`}>
                <IconComponent className={`w-5 h-5 ${colors?.icon}`} />
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-2xl font-bold text-foreground">{metric?.value}</p>
              <p className="text-xs font-medium text-foreground">{metric?.title}</p>
              <p className="text-xs text-muted-foreground">{metric?.subtitle}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PerformanceMetrics;