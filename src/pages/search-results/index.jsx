import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import { useSelector } from 'react-redux';
import { NotificationContainer } from '../../components/ui/NotificationToast';
import { LoadingSpinner } from '../../components/ui/LoadingState';

import Button from '../../components/ui/Button';
import SearchHeader from './components/SearchHeader';
import FilterSidebar from './components/FilterSidebar';
import SearchResultItem from './components/SearchResultItem';
import SortControls from './components/SortControls';
import SearchHistory from './components/SearchHistory';
import EmptySearchState from './components/EmptySearchState';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [filterSidebarOpen, setFilterSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list');

  // Search state
  const searchQuery = searchParams?.get('q') || '';
  const [sortBy, setSortBy] = useState('relevance');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filters, setFilters] = useState({
    categories: [],
    statuses: [],
    locations: [],
    dateRange: ''
  });

  // Get actual user from Redux store
  const { user } = useSelector((state) => state.auth);

  // Mock search results data
  const mockSearchResults = [
  {
    id: "AST-001",
    name: "ThinkPad X1 Carbon Gen 9",
    model: "20XW0015US",
    serialNumber: "PC123456",
    category: "laptop",
    status: "in_use",
    location: "HQ - Floor 2",
    assignedTo: "John Smith",
    dateAdded: "2024-03-15",
    relevanceScore: 95,
    isFavorite: false,
    image: "https://images.unsplash.com/photo-1735344221079-2924eb70eafe",
    imageAlt: "Black ThinkPad laptop open on white desk showing screen"
  },
  {
    id: "AST-002",
    name: "Dell OptiPlex 7090",
    model: "OptiPlex 7090 MT",
    serialNumber: "DL789012",
    category: "desktop",
    status: "in_storage",
    location: "Warehouse",
    assignedTo: null,
    dateAdded: "2024-02-20",
    relevanceScore: 87,
    isFavorite: true,
    image: "https://images.unsplash.com/photo-1625469312270-84092c6c0268",
    imageAlt: "Silver desktop computer tower on white background"
  },
  {
    id: "AST-003",
    name: "HP LaserJet Pro M404n",
    model: "W1A52A",
    serialNumber: "HP345678",
    category: "printer",
    status: "under_repair",
    location: "HQ - Floor 1",
    assignedTo: "IT Department",
    dateAdded: "2024-01-10",
    relevanceScore: 78,
    isFavorite: false,
    image: "https://images.unsplash.com/photo-1587491320304-7674dc8a1fc0",
    imageAlt: "White HP laser printer on office desk"
  },
  {
    id: "AST-004",
    name: "iPad Pro 12.9-inch",
    model: "MHNK3LL/A",
    serialNumber: "AP901234",
    category: "tablet",
    status: "in_use",
    location: "Tokyo Branch",
    assignedTo: "Marketing Team",
    dateAdded: "2024-04-05",
    relevanceScore: 82,
    isFavorite: false,
    image: "https://images.unsplash.com/photo-1629641754659-51576a8b6a03",
    imageAlt: "Silver iPad Pro with Apple Pencil on white surface"
  },
  {
    id: "AST-005",
    name: "Samsung 27-inch Monitor",
    model: "LF27T350FHNXZA",
    serialNumber: "SM567890",
    category: "monitor",
    status: "in_use",
    location: "HQ - Floor 2",
    assignedTo: "Development Team",
    dateAdded: "2024-03-28",
    relevanceScore: 73,
    isFavorite: false,
    image: "https://images.unsplash.com/photo-1606308707433-ad179ff19811",
    imageAlt: "Black Samsung monitor displaying colorful desktop wallpaper"
  }];


  // Mock search history and saved searches
  const [searchHistory] = useState([
  { query: "laptop", resultCount: 15, timestamp: "2024-10-17T10:30:00Z" },
  { query: "printer HP", resultCount: 8, timestamp: "2024-10-16T14:20:00Z" },
  { query: "monitor samsung", resultCount: 12, timestamp: "2024-10-15T09:15:00Z" }]
  );

  const [savedSearches] = useState([
  {
    name: "Available Laptops",
    query: "laptop",
    dateSaved: "2024-10-10T08:00:00Z",
    filters: { statuses: ['in_storage'] }
  },
  {
    name: "Repair Queue",
    query: "",
    dateSaved: "2024-10-08T16:30:00Z",
    filters: { statuses: ['under_repair'] }
  }]
  );

  const suggestions = ["laptop", "desktop computer", "printer", "monitor", "tablet"];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev?.filter((notif) => notif?.id !== id));
  };

  const handleSearch = (query) => {
    navigate(`/search-results?q=${encodeURIComponent(query)}`);
  };

  const handleFilterChange = (filterType, value, checked) => {
    setFilters((prev) => {
      if (filterType === 'dateRange') {
        return { ...prev, [filterType]: value };
      }

      const currentValues = prev?.[filterType] || [];
      if (checked) {
        return { ...prev, [filterType]: [...currentValues, value] };
      } else {
        return { ...prev, [filterType]: currentValues?.filter((v) => v !== value) };
      }
    });
  };

  const handleClearFilters = () => {
    setFilters({
      categories: [],
      statuses: [],
      locations: [],
      dateRange: ''
    });
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
  };

  const handleOrderChange = () => {
    setSortOrder((prev) => prev === 'asc' ? 'desc' : 'asc');
  };

  const handleAddToFavorites = (assetId) => {
    addNotification('Asset added to favorites', 'success');
  };

  const handleExport = () => {
    addNotification('Search results exported successfully', 'success');
  };

  const handleClearSearch = () => {
    navigate('/search-results');
  };

  const handleSaveSearch = () => {
    addNotification('Search saved successfully', 'success');
  };

  const handleSelectSearch = (query) => {
    navigate(`/search-results?q=${encodeURIComponent(query)}`);
  };

  const handleDeleteSearch = (index) => {
    addNotification('Search removed from history', 'info');
  };

  const handleDeleteSavedSearch = (index) => {
    addNotification('Saved search deleted', 'info');
  };

  const handleBrowseAssets = () => {
    navigate('/asset-list');
  };

  // Filter and sort results
  const filteredResults = mockSearchResults?.filter((asset) => {
    if (filters?.categories?.length > 0 && !filters?.categories?.includes(asset?.category)) {
      return false;
    }
    if (filters?.statuses?.length > 0 && !filters?.statuses?.includes(asset?.status)) {
      return false;
    }
    if (filters?.locations?.length > 0 && !filters?.locations?.some((loc) => asset?.location?.includes(loc))) {
      return false;
    }
    return true;
  });

  const sortedResults = [...filteredResults]?.sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case 'name':
        aValue = a?.name?.toLowerCase();
        bValue = b?.name?.toLowerCase();
        break;
      case 'dateAdded':
        aValue = new Date(a.dateAdded);
        bValue = new Date(b.dateAdded);
        break;
      case 'category':
        aValue = a?.category?.toLowerCase();
        bValue = b?.category?.toLowerCase();
        break;
      case 'status':
        aValue = a?.status?.toLowerCase();
        bValue = b?.status?.toLowerCase();
        break;
      case 'location':
        aValue = a?.location?.toLowerCase();
        bValue = b?.location?.toLowerCase();
        break;
      case 'relevance':
      default:
        aValue = a?.relevanceScore;
        bValue = b?.relevanceScore;
        break;
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          user={user} />

        <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'}`}>
          <Header
            user={user}
            onSearch={handleSearch}
            onNotificationClick={() => addNotification('Notifications clicked')}
            onProfileClick={(action) => addNotification(`Profile ${action} clicked`)} />

          <main className="pt-16 min-h-screen flex items-center justify-center">
            <div className="text-center">
              <LoadingSpinner size="xl" />
              <p className="mt-4 text-muted-foreground">Searching assets...</p>
            </div>
          </main>
        </div>
      </div>);

  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        user={user} />

      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'}`}>
        <Header
          user={user}
          onSearch={handleSearch}
          onNotificationClick={() => addNotification('Notifications clicked')}
          onProfileClick={(action) => addNotification(`Profile ${action} clicked`)} />

        
        <main className="pt-16 min-h-screen">
          {/* Search Header */}
          <SearchHeader
            searchQuery={searchQuery}
            resultCount={sortedResults?.length}
            onClearSearch={handleClearSearch}
            onSaveSearch={handleSaveSearch}
            suggestions={searchQuery && sortedResults?.length === 0 ? suggestions : []} />


          <div className="flex">
            {/* Filter Sidebar */}
            <FilterSidebar
              isOpen={filterSidebarOpen}
              onClose={() => setFilterSidebarOpen(false)}
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters} />


            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {searchQuery ?
              <>
                  {/* Mobile Filter Button */}
                  <div className="lg:hidden p-4 border-b border-border">
                    <Button
                    variant="outline"
                    iconName="Filter"
                    iconPosition="left"
                    onClick={() => setFilterSidebarOpen(true)}
                    className="w-full">

                      Filters
                      {Object.values(filters)?.some((filter) =>
                    Array.isArray(filter) ? filter?.length > 0 : filter
                    ) &&
                    <span className="ml-2 bg-accent text-accent-foreground text-xs px-2 py-0.5 rounded-full">
                          {Object.values(filters)?.reduce((count, filter) =>
                      count + (Array.isArray(filter) ? filter?.length : filter ? 1 : 0), 0
                      )}
                        </span>
                    }
                    </Button>
                  </div>

                  {sortedResults?.length > 0 ?
                <>
                      {/* Sort Controls */}
                      <SortControls
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onSortChange={handleSortChange}
                    onOrderChange={handleOrderChange}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    onExport={handleExport} />


                      {/* Search Results */}
                      <div className="p-6">
                        <div className={`space-y-4 ${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 space-y-0' : ''}`}>
                          {sortedResults?.map((asset) =>
                      <SearchResultItem
                        key={asset?.id}
                        asset={asset}
                        searchQuery={searchQuery}
                        onAddToFavorites={handleAddToFavorites} />

                      )}
                        </div>
                      </div>
                    </> :

                <EmptySearchState
                  searchQuery={searchQuery}
                  onClearSearch={handleClearSearch}
                  onBrowseAssets={handleBrowseAssets}
                  suggestions={suggestions} />

                }
                </> : (

              /* Search History and Saved Searches */
              <div className="p-6">
                  <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                      <h1 className="text-2xl font-bold text-foreground mb-2">Search Assets</h1>
                      <p className="text-muted-foreground">
                        Find assets by name, model, serial number, or category. Use the search bar above to get started.
                      </p>
                    </div>
                    
                    <SearchHistory
                    searchHistory={searchHistory}
                    savedSearches={savedSearches}
                    onSelectSearch={handleSelectSearch}
                    onDeleteSearch={handleDeleteSearch}
                    onDeleteSavedSearch={handleDeleteSavedSearch} />


                    {/* Quick Search Suggestions */}
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold text-foreground mb-4">Popular Searches</h3>
                      <div className="flex flex-wrap gap-3">
                        {suggestions?.map((suggestion, index) =>
                      <button
                        key={index}
                        onClick={() => handleSelectSearch(suggestion)}
                        className="px-4 py-2 bg-accent/10 text-accent rounded-lg hover:bg-accent/20 transition-colors text-sm font-medium">

                            {suggestion}
                          </button>
                      )}
                      </div>
                    </div>
                  </div>
                </div>)
              }
            </div>
          </div>
        </main>
      </div>
      <NotificationContainer
        notifications={notifications}
        onRemove={removeNotification} />

    </div>);

};

export default SearchResults;