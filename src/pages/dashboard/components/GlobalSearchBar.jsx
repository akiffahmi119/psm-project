import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';

const GlobalSearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Mock search suggestions
  const mockSuggestions = [
    { id: 'AST-001', type: 'asset', name: 'Dell Laptop OptiPlex 7090', category: 'Laptop' },
    { id: 'AST-002', type: 'asset', name: 'HP Printer LaserJet Pro', category: 'Printer' },
    { id: 'AST-003', type: 'asset', name: 'Cisco Router ISR4331', category: 'Network Equipment' },
    { id: 'SN123456', type: 'serial', name: 'Serial: SN123456 - Monitor Dell U2720Q', category: 'Monitor' },
    { id: 'MDL-HP-001', type: 'model', name: 'Model: HP EliteBook 840 G8', category: 'Laptop' }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef?.current && !searchRef?.current?.contains(event?.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e) => {
    const query = e?.target?.value;
    setSearchQuery(query);

    if (query?.length > 2) {
      setIsLoading(true);
      // Simulate API call delay
      setTimeout(() => {
        const filtered = mockSuggestions?.filter(item =>
          item?.name?.toLowerCase()?.includes(query?.toLowerCase()) ||
          item?.id?.toLowerCase()?.includes(query?.toLowerCase())
        );
        setSuggestions(filtered);
        setShowSuggestions(true);
        setIsLoading(false);
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (searchQuery?.trim()) {
      navigate(`/search-results?q=${encodeURIComponent(searchQuery)}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    if (suggestion?.type === 'asset') {
      navigate(`/asset-details/${suggestion?.id}`);
    } else {
      navigate(`/search-results?q=${encodeURIComponent(suggestion?.id)}`);
    }
    setSearchQuery('');
    setShowSuggestions(false);
  };

  const getSuggestionIcon = (type) => {
    switch (type) {
      case 'asset':
        return 'Package';
      case 'serial':
        return 'Hash';
      case 'model':
        return 'Tag';
      default:
        return 'Search';
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      <form onSubmit={handleSearchSubmit}>
        <div className="relative">
          <Input
            type="search"
            placeholder="Search assets by ID, serial number, or model..."
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => searchQuery?.length > 2 && setShowSuggestions(true)}
            className="pl-10 pr-4 h-12 text-base bg-background border-border focus:border-primary"
          />
          <Icon
            name="Search"
            size={20}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
          />
          {isLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-muted border-t-primary"></div>
            </div>
          )}
        </div>
      </form>
      {/* Search Suggestions Dropdown */}
      {showSuggestions && suggestions?.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-lg shadow-modal z-200 max-h-80 overflow-y-auto">
          <div className="p-2">
            <div className="text-xs font-medium text-muted-foreground px-3 py-2 border-b border-border">
              Search Results
            </div>
            {suggestions?.map((suggestion) => (
              <button
                key={suggestion?.id}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full flex items-center space-x-3 px-3 py-3 text-left hover:bg-muted rounded-lg transition-colors"
              >
                <Icon 
                  name={getSuggestionIcon(suggestion?.type)} 
                  size={16} 
                  className="text-muted-foreground flex-shrink-0" 
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {suggestion?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {suggestion?.category} • ID: {suggestion?.id}
                  </p>
                </div>
                <Icon name="ArrowRight" size={14} className="text-muted-foreground flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}
      {/* No Results */}
      {showSuggestions && suggestions?.length === 0 && searchQuery?.length > 2 && !isLoading && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-lg shadow-modal z-200">
          <div className="p-4 text-center">
            <Icon name="Search" size={24} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No assets found for "{searchQuery}"</p>
            <p className="text-xs text-muted-foreground mt-1">Try searching by asset ID, serial number, or model</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalSearchBar;