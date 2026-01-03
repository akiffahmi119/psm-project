import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';


const FilterToolbar = ({ filters, onFilterChange, suppliersCount }) => {
  const handleSearchChange = (e) => {
    onFilterChange({ search: e?.target?.value });
  };

  const handleStatusChange = (e) => {
    onFilterChange({ status: e?.target?.value });
  };

  const handleRatingChange = (e) => {
    onFilterChange({ rating: e?.target?.value });
  };

  const clearFilters = () => {
    onFilterChange({
      search: '',
      status: 'all',
      rating: 'all'
    });
  };

  const hasActiveFilters = filters?.search || filters?.status !== 'all' || filters?.rating !== 'all';

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'pending', label: 'Pending' },
    { value: 'inactive', label: 'Inactive' }
  ];

  const ratingOptions = [
    { value: 'all', label: 'All Ratings' },
    { value: '4.5', label: '4.5+ Stars' },
    { value: '4.0', label: '4.0+ Stars' },
    { value: '3.5', label: '3.5+ Stars' },
    { value: '3.0', label: '3.0+ Stars' }
  ];

  return (
    <div className="bg-card border rounded-lg p-4">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Search Input */}
        <div className="flex-1 min-w-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search suppliers by name, contact, or email..."
              value={filters?.search}
              onChange={handleSearchChange}
              className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <select
            value={filters?.status}
            onChange={handleStatusChange}
            className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-w-[120px]"
          >
            {statusOptions?.map(option => (
              <option key={option?.value} value={option?.value}>
                {option?.label}
              </option>
            ))}
          </select>

          {/* Rating Filter */}
          <select
            value={filters?.rating}
            onChange={handleRatingChange}
            className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-w-[120px]"
          >
            {ratingOptions?.map(option => (
              <option key={option?.value} value={option?.value}>
                {option?.label}
              </option>
            ))}
          </select>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              iconName="X"
              iconPosition="left"
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {suppliersCount === 1 
            ? '1 supplier found' 
            : `${suppliersCount} suppliers found`
          }
        </div>
        
        {/* Active Filters Indicator */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Filter className="w-3 h-3" />
            <span>Filters active</span>
          </div>
        )}
      </div>

      {/* Active Filter Tags */}
      {hasActiveFilters && (
        <div className="mt-3 flex flex-wrap gap-2">
          {filters?.search && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-md">
              Search: "{filters?.search}"
              <button
                onClick={() => onFilterChange({ search: '' })}
                className="hover:text-primary/80 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters?.status !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-md capitalize">
              Status: {filters?.status}
              <button
                onClick={() => onFilterChange({ status: 'all' })}
                className="hover:text-primary/80 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters?.rating !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-md">
              Rating: {filters?.rating}+ Stars
              <button
                onClick={() => onFilterChange({ rating: 'all' })}
                className="hover:text-primary/80 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterToolbar;