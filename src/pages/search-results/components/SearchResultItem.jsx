import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const SearchResultItem = ({ asset, searchQuery, onAddToFavorites }) => {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case 'in_use':
        return 'bg-success/10 text-success border-success/20';
      case 'in_storage':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'under_repair':
        return 'bg-error/10 text-error border-error/20';
      case 'retired':
        return 'bg-muted text-muted-foreground border-border';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'in_use':
        return 'In Use';
      case 'in_storage':
        return 'In Storage';
      case 'under_repair':
        return 'Under Repair';
      case 'retired':
        return 'Retired';
      default:
        return 'Unknown';
    }
  };

  const highlightSearchTerm = (text, searchTerm) => {
    if (!searchTerm || !text) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text?.split(regex);
    
    return parts?.map((part, index) => 
      regex?.test(part) ? (
        <mark key={index} className="bg-accent/20 text-accent font-medium">
          {part}
        </mark>
      ) : part
    );
  };

  const handleViewDetails = () => {
    navigate(`/asset-details?id=${asset?.id}`);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-subtle transition-shadow">
      <div className="flex items-start space-x-4">
        {/* Asset Image */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden">
            <Image
              src={asset?.image}
              alt={asset?.imageAlt}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Asset Information */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground mb-1">
                {highlightSearchTerm(asset?.name, searchQuery)}
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                {highlightSearchTerm(asset?.model, searchQuery)} • 
                Serial: {highlightSearchTerm(asset?.serialNumber, searchQuery)}
              </p>
              
              <div className="flex items-center space-x-4 mb-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(asset?.status)}`}>
                  {getStatusLabel(asset?.status)}
                </span>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Icon name="MapPin" size={14} className="mr-1" />
                  {asset?.location}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Icon name="Tag" size={14} className="mr-1" />
                  {asset?.category}
                </div>
              </div>

              {/* Relevance Score */}
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-xs text-muted-foreground">Relevance:</span>
                <div className="flex items-center space-x-1">
                  {[...Array(5)]?.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index < Math.floor(asset?.relevanceScore / 20)
                          ? 'bg-accent' :'bg-muted'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  {asset?.relevanceScore}%
                </span>
              </div>

              {/* Additional Details */}
              <div className="text-sm text-muted-foreground">
                <p>Added: {new Date(asset.dateAdded)?.toLocaleDateString()}</p>
                {asset?.assignedTo && (
                  <p>Assigned to: {asset?.assignedTo}</p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-2 ml-4">
              <Button
                variant="ghost"
                size="icon"
                iconName={asset?.isFavorite ? "Heart" : "Heart"}
                onClick={() => onAddToFavorites(asset?.id)}
                className={asset?.isFavorite ? "text-error" : "text-muted-foreground hover:text-error"}
              />
              <Button
                variant="outline"
                size="sm"
                iconName="Eye"
                iconPosition="left"
                onClick={handleViewDetails}
              >
                View Details
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultItem;