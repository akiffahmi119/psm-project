import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmptySearchState = ({ 
  searchQuery, 
  onClearSearch, 
  onBrowseAssets,
  suggestions = [] 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
        <Icon name="Search" size={32} className="text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-semibold text-foreground mb-2">
        No results found
      </h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        We couldn't find any assets matching "{searchQuery}". Try adjusting your search terms or browse all assets.
      </p>
      {/* Search Suggestions */}
      {suggestions?.length > 0 && (
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-3">Try searching for:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {suggestions?.map((suggestion, index) => (
              <button
                key={index}
                className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm hover:bg-accent/20 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="outline"
          iconName="RotateCcw"
          iconPosition="left"
          onClick={onClearSearch}
        >
          Clear Search
        </Button>
        <Button
          variant="default"
          iconName="Package"
          iconPosition="left"
          onClick={onBrowseAssets}
        >
          Browse All Assets
        </Button>
      </div>
      {/* Search Tips */}
      <div className="mt-8 p-4 bg-muted/50 rounded-lg max-w-md">
        <h3 className="text-sm font-medium text-foreground mb-2">Search Tips:</h3>
        <ul className="text-xs text-muted-foreground space-y-1 text-left">
          <li>• Try using different keywords</li>
          <li>• Check for typos in your search</li>
          <li>• Use broader terms (e.g., "laptop" instead of "ThinkPad X1")</li>
          <li>• Search by serial number or asset ID</li>
        </ul>
      </div>
    </div>
  );
};

export default EmptySearchState;