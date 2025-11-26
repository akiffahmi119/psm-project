import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SearchHeader = ({ 
  searchQuery, 
  resultCount, 
  onClearSearch, 
  onSaveSearch,
  suggestions = [] 
}) => {
  return (
    <div className="bg-card border-b border-border p-6">
      <div className="max-w-7xl mx-auto">
        {/* Search Query Display */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Icon name="Search" size={20} className="text-muted-foreground" />
            <div>
              <h1 className="text-xl font-semibold text-foreground">
                Search Results for "{searchQuery}"
              </h1>
              <p className="text-sm text-muted-foreground">
                {resultCount} assets found
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              iconName="Bookmark"
              iconPosition="left"
              onClick={onSaveSearch}
              className="hidden sm:flex"
            >
              Save Search
            </Button>
            <Button
              variant="ghost"
              iconName="X"
              onClick={onClearSearch}
            >
              Clear
            </Button>
          </div>
        </div>

        {/* Search Suggestions */}
        {suggestions?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground">Did you mean:</span>
            {suggestions?.map((suggestion, index) => (
              <button
                key={index}
                className="text-sm text-accent hover:text-accent-foreground hover:bg-accent/10 px-2 py-1 rounded transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchHeader;