import React, { useState, useMemo } from 'react';
import { Edit, Trash2, Phone, Mail, Globe, Star } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { cn } from '../../../utils/cn';

const SupplierTable = ({ suppliers, selectedSupplier, onSupplierSelect, onSupplierEdit, onSupplierDelete }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-success/10 text-success border-success/20',
      pending: 'bg-warning/10 text-warning border-warning/20',
      inactive: 'bg-muted text-muted-foreground border-muted'
    };
    return colors?.[status] || colors?.inactive;
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig?.key === key && sortConfig?.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedSuppliers = React.useMemo(() => {
    let sortableSuppliers = [...suppliers];
    if (sortConfig?.key) {
      sortableSuppliers?.sort((a, b) => {
        if (a?.[sortConfig?.key] < b?.[sortConfig?.key]) {
          return sortConfig?.direction === 'asc' ? -1 : 1;
        }
        if (a?.[sortConfig?.key] > b?.[sortConfig?.key]) {
          return sortConfig?.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableSuppliers;
  }, [suppliers, sortConfig]);

  const formatCurrency = (value) => {
    if (!value) return '$0';
    return value;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString)?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderRating = (rating) => {
    const stars = Array?.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={cn(
          "w-3 h-3",
          index < Math?.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
        )}
      />
    ));
    return (
      <div className="flex items-center gap-1">
        {stars}
        <span className="text-xs text-muted-foreground ml-1">({rating})</span>
      </div>
    );
  };

  if (!suppliers || suppliers?.length === 0) {
    return (
      <div className="bg-card border rounded-lg p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Globe className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No Suppliers Found</h3>
          <p className="text-muted-foreground mb-4">
            No suppliers match your current filters. Try adjusting your search criteria.
          </p>
          <Button variant="outline" onClick={() => window?.location?.reload()}>
            Reset Filters
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 font-medium text-muted-foreground">
                <button
                  onClick={() => handleSort('companyName')}
                  className="flex items-center gap-2 hover:text-foreground transition-colors"
                >
                  Company
                  {sortConfig?.key === 'companyName' && (
                    <span className="text-xs">
                      {sortConfig?.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </button>
              </th>
              <th className="text-left p-4 font-medium text-muted-foreground">
                Contact Person
              </th>
              <th className="text-left p-4 font-medium text-muted-foreground">
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center gap-2 hover:text-foreground transition-colors"
                >
                  Status
                  {sortConfig?.key === 'status' && (
                    <span className="text-xs">
                      {sortConfig?.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </button>
              </th>
              <th className="text-left p-4 font-medium text-muted-foreground">
                <button
                  onClick={() => handleSort('rating')}
                  className="flex items-center gap-2 hover:text-foreground transition-colors"
                >
                  Rating
                  {sortConfig?.key === 'rating' && (
                    <span className="text-xs">
                      {sortConfig?.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </button>
              </th>
              <th className="text-left p-4 font-medium text-muted-foreground">
                <button
                  onClick={() => handleSort('totalValue')}
                  className="flex items-center gap-2 hover:text-foreground transition-colors"
                >
                  Total Value
                  {sortConfig?.key === 'totalValue' && (
                    <span className="text-xs">
                      {sortConfig?.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </button>
              </th>
              <th className="text-left p-4 font-medium text-muted-foreground">
                <button
                  onClick={() => handleSort('lastInteraction')}
                  className="flex items-center gap-2 hover:text-foreground transition-colors"
                >
                  Last Contact
                  {sortConfig?.key === 'lastInteraction' && (
                    <span className="text-xs">
                      {sortConfig?.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </button>
              </th>
              <th className="text-center p-4 font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedSuppliers?.map((supplier) => (
              <tr
                key={supplier?.id}
                className={cn(
                  "border-t hover:bg-muted/50 cursor-pointer transition-colors",
                  selectedSupplier?.id === supplier?.id && "bg-muted/50"
                )}
                onClick={() => onSupplierSelect(supplier)}
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {supplier?.image && (
                      <img
                        src={supplier?.image}
                        alt={supplier?.imageAlt || `${supplier?.companyName} building`}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <div className="font-medium text-foreground flex items-center gap-2">
                        {supplier?.companyName}
                        {supplier?.preferredVendor && (
                          <span className="w-2 h-2 bg-primary rounded-full" title="Preferred Vendor" />
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">{supplier?.category}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div>
                    <div className="font-medium text-foreground">{supplier?.contactPerson}</div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="w-3 h-3" />
                      {supplier?.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="w-3 h-3" />
                      {supplier?.phone}
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span
                    className={cn(
                      "inline-flex px-2 py-1 rounded-md text-xs font-medium border capitalize",
                      getStatusColor(supplier?.status)
                    )}
                  >
                    {supplier?.status}
                  </span>
                </td>
                <td className="p-4">
                  {renderRating(supplier?.rating)}
                </td>
                <td className="p-4">
                  <div>
                    <div className="font-medium text-foreground">
                      {formatCurrency(supplier?.totalValue)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {supplier?.totalOrders} orders
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-sm text-foreground">
                    {formatDate(supplier?.lastInteraction)}
                  </div>
                </td>
                <td className="p-4" onClick={(e) => e?.stopPropagation()}>
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onSupplierEdit(supplier)}
                      className="h-8 w-8"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onSupplierDelete(supplier?.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SupplierTable;