import React, { useState, useEffect, useMemo } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import AppIcon from '../../../components/AppIcon';
import { supabase } from '../../../lib/supabaseClient';

const DepartmentSearchModal = ({ onDepartmentSelect, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('departments')
        .select(`
          id,
          name,
          description,
          created_at
        `);

      if (error) {
        console.error('Error fetching departments:', error);
        // Optionally add a notification for the error
      } else {
        setDepartments(data);
      }
      setIsLoading(false);
    };

    fetchDepartments();
  }, []);

  // Filter departments based on search query
  const filteredDepartments = useMemo(() => {
    let filtered = departments || [];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((department) =>
        department.name.toLowerCase().includes(query) ||
        department.description?.toLowerCase().includes(query)
      );
    }
    return filtered;
  }, [departments, searchQuery]);

  const handleDepartmentSelect = (department) => {
    onDepartmentSelect?.(department);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-xl border border-border shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Select Department</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Choose which department will be assigned this asset
            </p>
          </div>
          <Button variant="ghost" size="sm" iconName="X" onClick={onClose} />
        </div>

        {/* Search */}
        <div className="p-6 border-b border-border">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search by department name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
            <AppIcon
              name="Search"
              size={16}
              className="absolute right-3 top-3 text-muted-foreground"
            />
          </div>
        </div>

        {/* Department List */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-lg border border-border animate-pulse">
                  <div className="w-12 h-12 rounded-full bg-muted"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-1/3"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredDepartments.length > 0 ? (
            <div className="space-y-2">
              {filteredDepartments.map((department) => (
                <div
                  key={department.id}
                  className="flex items-center gap-4 p-4 rounded-lg border border-border hover:shadow-md hover:border-primary/30 transition-all duration-200 cursor-pointer"
                  onClick={() => handleDepartmentSelect(department)}
                >
                  <AppIcon name="Building" size={24} className="text-primary" />
                  {/* Department Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground truncate">{department.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">{department.description}</p>
                  </div>
                  {/* Select Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Check"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDepartmentSelect(department);
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <AppIcon name="Building" size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No Departments Found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? 'Try adjusting your search criteria.' : 'No departments are currently available.'}
              </p>
              {searchQuery && (
                <Button variant="outline" onClick={() => setSearchQuery('')}>
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <p className="text-sm text-muted-foreground">
            {isLoading ? 'Loading departments...' : `${filteredDepartments.length} of ${departments.length} departments shown`}
          </p>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DepartmentSearchModal;
