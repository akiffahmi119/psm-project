import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';
import { useNavigate } from 'react-router-dom';

const ForecastTable = ({ filters }) => {
  const navigate = useNavigate();
  const [sortField, setSortField] = useState('replacementDate');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const forecastData = [
    {
      id: 'AST-2019-001',
      assetName: 'Dell Latitude 7420',
      category: 'Laptops',
      department: 'IT Department',
      purchaseDate: '2019-03-15',
      replacementDate: '2024-11-20',
      estimatedCost: 1200,
      priority: 'High',
      status: 'Active',
      assignedTo: 'John Smith',
      warrantyExpiry: '2022-03-15',
      condition: 'Fair'
    },
    {
      id: 'AST-2019-045',
      assetName: 'HP EliteDesk 800 G5',
      category: 'Desktops',
      department: 'Finance',
      purchaseDate: '2019-06-10',
      replacementDate: '2024-12-01',
      estimatedCost: 950,
      priority: 'Medium',
      status: 'Active',
      assignedTo: 'Sarah Johnson',
      warrantyExpiry: '2022-06-10',
      condition: 'Good'
    },
    {
      id: 'AST-2018-123',
      assetName: 'Dell UltraSharp U2719D',
      category: 'Monitors',
      department: 'Marketing',
      purchaseDate: '2018-11-22',
      replacementDate: '2024-12-15',
      estimatedCost: 350,
      priority: 'Low',
      status: 'Active',
      assignedTo: 'Mike Chen',
      warrantyExpiry: '2021-11-22',
      condition: 'Fair'
    },
    {
      id: 'AST-2019-078',
      assetName: 'Lenovo ThinkPad X1 Carbon',
      category: 'Laptops',
      department: 'Sales',
      purchaseDate: '2019-08-05',
      replacementDate: '2025-01-10',
      estimatedCost: 1400,
      priority: 'High',
      status: 'Active',
      assignedTo: 'Emily Davis',
      warrantyExpiry: '2022-08-05',
      condition: 'Poor'
    },
    {
      id: 'AST-2020-012',
      assetName: 'HP ProDesk 600 G6',
      category: 'Desktops',
      department: 'HR',
      purchaseDate: '2020-02-18',
      replacementDate: '2025-01-25',
      estimatedCost: 800,
      priority: 'Medium',
      status: 'Active',
      assignedTo: 'Robert Wilson',
      warrantyExpiry: '2023-02-18',
      condition: 'Good'
    },
    {
      id: 'AST-2019-156',
      assetName: 'Dell PowerEdge R740',
      category: 'Servers',
      department: 'IT Department',
      purchaseDate: '2019-12-03',
      replacementDate: '2025-02-08',
      estimatedCost: 4500,
      priority: 'Critical',
      status: 'Active',
      assignedTo: 'IT Infrastructure',
      warrantyExpiry: '2022-12-03',
      condition: 'Fair'
    },
    {
      id: 'AST-2020-089',
      assetName: 'LG 27UK850-W',
      category: 'Monitors',
      department: 'Engineering',
      purchaseDate: '2020-04-12',
      replacementDate: '2025-02-20',
      estimatedCost: 420,
      priority: 'Low',
      status: 'Active',
      assignedTo: 'Alex Thompson',
      warrantyExpiry: '2023-04-12',
      condition: 'Good'
    },
    {
      id: 'AST-2019-234',
      assetName: 'MacBook Pro 16-inch',
      category: 'Laptops',
      department: 'Research',
      purchaseDate: '2019-10-15',
      replacementDate: '2025-03-05',
      estimatedCost: 2200,
      priority: 'High',
      status: 'Active',
      assignedTo: 'Dr. Lisa Park',
      warrantyExpiry: '2022-10-15',
      condition: 'Fair'
    }
  ];

  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'Critical', label: 'Critical' },
    { value: 'High', label: 'High' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Low', label: 'Low' }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'bg-error text-error-foreground';
      case 'High': return 'bg-warning text-warning-foreground';
      case 'Medium': return 'bg-accent text-accent-foreground';
      case 'Low': return 'bg-success text-success-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleViewAsset = (assetId) => {
    navigate(`/asset-details?id=${assetId}`);
  };

  const handleExportData = () => {
    // Mock export functionality
    const csvContent = forecastData?.map(asset => 
      `${asset?.id},${asset?.assetName},${asset?.category},${asset?.department},${asset?.replacementDate},${asset?.estimatedCost},${asset?.priority}`
    )?.join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL?.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lifecycle-forecast.csv';
    a?.click();
  };

  const sortedData = [...forecastData]?.sort((a, b) => {
    let aValue = a?.[sortField];
    let bValue = b?.[sortField];
    
    if (sortField === 'replacementDate' || sortField === 'purchaseDate') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const totalPages = Math.ceil(sortedData?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData?.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Asset Replacement Forecast</h3>
            <p className="text-sm text-muted-foreground">
              Assets scheduled for replacement based on lifecycle policies
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Select
              options={priorityOptions}
              value="all"
              onChange={() => {}}
              placeholder="Filter by priority"
              className="w-40"
            />
            <Button
              variant="outline"
              iconName="Download"
              onClick={handleExportData}
            >
              Export CSV
            </Button>
          </div>
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                <button
                  onClick={() => handleSort('assetName')}
                  className="flex items-center space-x-1 hover:text-foreground"
                >
                  <span>Asset</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                <button
                  onClick={() => handleSort('category')}
                  className="flex items-center space-x-1 hover:text-foreground"
                >
                  <span>Category</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                <button
                  onClick={() => handleSort('replacementDate')}
                  className="flex items-center space-x-1 hover:text-foreground"
                >
                  <span>Replacement Date</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                <button
                  onClick={() => handleSort('estimatedCost')}
                  className="flex items-center space-x-1 hover:text-foreground"
                >
                  <span>Est. Cost</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Priority</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Department</th>
              <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData?.map((asset, index) => (
              <tr key={asset?.id} className="border-t border-border hover:bg-muted/30">
                <td className="p-4">
                  <div>
                    <div className="font-medium text-foreground">{asset?.assetName}</div>
                    <div className="text-sm text-muted-foreground">{asset?.id}</div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-sm text-foreground">{asset?.category}</span>
                </td>
                <td className="p-4">
                  <div className="text-sm text-foreground">{formatDate(asset?.replacementDate)}</div>
                  <div className="text-xs text-muted-foreground">
                    Purchased: {formatDate(asset?.purchaseDate)}
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-sm font-medium text-foreground">
                    {formatCurrency(asset?.estimatedCost)}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(asset?.priority)}`}>
                    {asset?.priority}
                  </span>
                </td>
                <td className="p-4">
                  <div className="text-sm text-foreground">{asset?.department}</div>
                  <div className="text-xs text-muted-foreground">{asset?.assignedTo}</div>
                </td>
                <td className="p-4 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Eye"
                    onClick={() => handleViewAsset(asset?.id)}
                  >
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedData?.length)} of {sortedData?.length} assets
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="ChevronLeft"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </Button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)?.map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className="w-8 h-8"
                >
                  {page}
                </Button>
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              iconName="ChevronRight"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForecastTable;