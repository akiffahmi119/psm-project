import React from 'react';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const SortControls = ({ 
  sortBy, 
  sortOrder, 
  onSortChange, 
  onOrderChange, 
  viewMode, 
  onViewModeChange,
  onExport 
}) => {
  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'name', label: 'Name' },
    { value: 'dateAdded', label: 'Date Added' },
    { value: 'category', label: 'Category' },
    { value: 'status', label: 'Status' },
    { value: 'location', label: 'Location' }
  ];

  return (
    <div className="flex items-center justify-between bg-card border-b border-border p-4">
      <div className="flex items-center space-x-4">
        {/* Sort By */}
        <div className="flex items-center space-x-2">
          <Icon name="ArrowUpDown" size={16} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <Select
            options={sortOptions}
            value={sortBy}
            onChange={onSortChange}
            className="w-32"
          />
        </div>

        {/* Sort Order */}
        <Button
          variant="ghost"
          size="sm"
          iconName={sortOrder === 'asc' ? "ArrowUp" : "ArrowDown"}
          iconPosition="left"
          onClick={onOrderChange}
          className="text-muted-foreground hover:text-foreground"
        >
          {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        {/* View Mode Toggle */}
        <div className="flex items-center bg-muted rounded-lg p-1">
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            iconName="List"
            onClick={() => onViewModeChange('list')}
            className="h-8 w-8"
          />
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            iconName="Grid3X3"
            onClick={() => onViewModeChange('grid')}
            className="h-8 w-8"
          />
        </div>

        {/* Export Button */}
        <Button
          variant="outline"
          size="sm"
          iconName="Download"
          iconPosition="left"
          onClick={onExport}
          className="hidden sm:flex"
        >
          Export CSV
        </Button>
      </div>
    </div>
  );
};

export default SortControls;