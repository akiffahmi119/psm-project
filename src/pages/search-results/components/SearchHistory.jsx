import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SearchHistory = ({ 
  searchHistory, 
  savedSearches, 
  onSelectSearch, 
  onDeleteSearch,
  onDeleteSavedSearch 
}) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Searches */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <Icon name="Clock" size={18} className="mr-2" />
            Recent Searches
          </h3>
          
          {searchHistory?.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recent searches</p>
          ) : (
            <div className="space-y-2">
              {searchHistory?.map((search, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                >
                  <button
                    onClick={() => onSelectSearch(search?.query)}
                    className="flex-1 text-left"
                  >
                    <div className="text-sm font-medium text-foreground">
                      {search?.query}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {search?.resultCount} results • {new Date(search.timestamp)?.toLocaleDateString()}
                    </div>
                  </button>
                  <Button
                    variant="ghost"
                    size="icon"
                    iconName="X"
                    onClick={() => onDeleteSearch(index)}
                    className="h-6 w-6 text-muted-foreground hover:text-foreground"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Saved Searches */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <Icon name="Bookmark" size={18} className="mr-2" />
            Saved Searches
          </h3>
          
          {savedSearches?.length === 0 ? (
            <p className="text-sm text-muted-foreground">No saved searches</p>
          ) : (
            <div className="space-y-2">
              {savedSearches?.map((search, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-accent/10 rounded-lg hover:bg-accent/20 transition-colors"
                >
                  <button
                    onClick={() => onSelectSearch(search?.query)}
                    className="flex-1 text-left"
                  >
                    <div className="text-sm font-medium text-foreground">
                      {search?.name || search?.query}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Query: "{search?.query}" • Saved {new Date(search.dateSaved)?.toLocaleDateString()}
                    </div>
                  </button>
                  <Button
                    variant="ghost"
                    size="icon"
                    iconName="Trash2"
                    onClick={() => onDeleteSavedSearch(index)}
                    className="h-6 w-6 text-muted-foreground hover:text-error"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchHistory;