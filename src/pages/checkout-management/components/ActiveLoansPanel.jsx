import React, { useState, useMemo } from 'react';
import Button from '../../../components/ui/Button';
import AppIcon from '../../../components/AppIcon';
import { cn } from '../../../utils/cn';

const ActiveLoansPanel = ({ loans, filters, onCheckIn, onBulkOperation }) => {
  const [selectedLoans, setSelectedLoans] = useState([]);
  const [sortBy, setSortBy] = useState('checkoutDate');
  const [sortOrder, setSortOrder] = useState('desc');

  // Filter and sort loans
  const filteredLoans = useMemo(() => {
    let filtered = loans || [];

    // Apply filters
    if (filters?.employee) {
      filtered = filtered?.filter(loan =>
        loan?.employee?.name?.toLowerCase()?.includes(filters?.employee?.toLowerCase()) ||
        loan?.employee?.email?.toLowerCase()?.includes(filters?.employee?.toLowerCase())
      );
    }

    if (filters?.department) {
      filtered = filtered?.filter(loan =>
        loan?.employee?.department?.toLowerCase() === filters?.department?.toLowerCase()
      );
    }

    if (filters?.category) {
      filtered = filtered?.filter(loan =>
        loan?.assetCategory?.toLowerCase() === filters?.category?.toLowerCase()
      );
    }

    if (filters?.status && filters?.status !== 'all') {
      filtered = filtered?.filter(loan => {
        switch (filters?.status) {
          case 'active':
            return loan?.status === 'active' && !isOverdue(loan);
          case 'overdue':
            return isOverdue(loan);
          case 'due-soon':
            return isDueSoon(loan);
          default:
            return true;
        }
      });
    }

    if (filters?.overdue) {
      filtered = filtered?.filter(loan => isOverdue(loan));
    }

    // Sort loans
    filtered?.sort((a, b) => {
      let aValue = a?.[sortBy];
      let bValue = b?.[sortBy];

      if (sortBy === 'employee') {
        aValue = a?.employee?.name;
        bValue = b?.employee?.name;
      } else if (sortBy === 'assetName') {
        aValue = a?.assetName;
        bValue = b?.assetName;
      }

      if (aValue instanceof Date && bValue instanceof Date) {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue?.localeCompare(bValue)
          : bValue?.localeCompare(aValue);
      }

      return 0;
    });

    return filtered;
  }, [loans, filters, sortBy, sortOrder]);

  const isOverdue = (loan) => {
    return new Date() > new Date(loan?.expectedReturnDate);
  };

  const isDueSoon = (loan) => {
    const dueDate = new Date(loan?.expectedReturnDate);
    const today = new Date();
    const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
    return daysUntilDue >= 0 && daysUntilDue <= 7;
  };

  const getUrgencyColor = (loan) => {
    if (isOverdue(loan)) return 'text-error';
    if (isDueSoon(loan)) return 'text-warning';
    return 'text-success';
  };

  const getUrgencyBadge = (loan) => {
    if (isOverdue(loan)) return { label: 'Overdue', color: 'bg-error/10 text-error border-error/20' };
    if (isDueSoon(loan)) return { label: 'Due Soon', color: 'bg-warning/10 text-warning border-warning/20' };
    return { label: 'Active', color: 'bg-success/10 text-success border-success/20' };
  };

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysRemaining = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return '1 day remaining';
    return `${diffDays} days remaining`;
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleSelectLoan = (loanId) => {
    setSelectedLoans(prev =>
      prev?.includes(loanId)
        ? prev?.filter(id => id !== loanId)
        : [...prev, loanId]
    );
  };

  const handleSelectAll = () => {
    if (selectedLoans?.length === filteredLoans?.length) {
      setSelectedLoans([]);
    } else {
      setSelectedLoans(filteredLoans?.map(loan => loan?.id));
    }
  };

  const handleBulkCheckIn = () => {
    onBulkOperation?.('bulk-checkin', selectedLoans);
    setSelectedLoans([]);
  };

  const handleSendReminder = (loan) => {
    onBulkOperation?.('send-reminder', [loan?.id]);
  };

  const SortButton = ({ field, children }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 hover:text-primary transition-colors"
    >
      {children}
      <AppIcon
        name={sortBy === field ? (sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'}
        size={14}
      />
    </button>
  );

  if (!filteredLoans?.length) {
    return (
      <div className="text-center py-12">
        <AppIcon name="Package" size={48} className="mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">No Active Loans</h3>
        <p className="text-muted-foreground mb-6">
          {loans?.length ? 'No loans match your current filters.' : 'All assets are currently available for checkout.'}
        </p>
        {loans?.length && (
          <Button variant="outline" onClick={() => onBulkOperation?.('clear-filters', [])}>
            Clear Filters
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Bulk Actions Bar */}
      {selectedLoans?.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <span className="text-sm font-medium text-foreground">
            {selectedLoans?.length} item{selectedLoans?.length !== 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Mail"
              iconPosition="left"
              onClick={() => onBulkOperation?.('send-reminders', selectedLoans)}
            >
              Send Reminders
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="LogIn"
              iconPosition="left"
              onClick={handleBulkCheckIn}
            >
              Bulk Check In
            </Button>
            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              onClick={() => setSelectedLoans([])}
            />
          </div>
        </div>
      )}

      {/* Table Header */}
      <div className="bg-muted/50 rounded-lg p-4 border border-border">
        <div className="grid grid-cols-12 gap-4 items-center text-sm font-medium text-muted-foreground">
          <div className="col-span-1">
            <input
              type="checkbox"
              checked={selectedLoans?.length === filteredLoans?.length && filteredLoans?.length > 0}
              onChange={handleSelectAll}
              className="w-4 h-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
          </div>
          <div className="col-span-3">
            <SortButton field="assetName">Asset</SortButton>
          </div>
          <div className="col-span-2">
            <SortButton field="employee">Employee</SortButton>
          </div>
          <div className="col-span-2">
            <SortButton field="checkoutDate">Checked Out</SortButton>
          </div>
          <div className="col-span-2">
            <SortButton field="expectedReturnDate">Due Date</SortButton>
          </div>
          <div className="col-span-1">Status</div>
          <div className="col-span-1">Actions</div>
        </div>
      </div>

      {/* Loans List */}
      <div className="space-y-2">
        {filteredLoans?.map((loan) => {
          const urgencyBadge = getUrgencyBadge(loan);
          
          return (
            <div
              key={loan?.id}
              className={cn(
                "bg-card rounded-lg border border-border p-4 transition-all duration-200 hover:shadow-md",
                selectedLoans?.includes(loan?.id) && "ring-2 ring-primary/20 border-primary/30"
              )}
            >
              <div className="grid grid-cols-12 gap-4 items-center">
                {/* Checkbox */}
                <div className="col-span-1">
                  <input
                    type="checkbox"
                    checked={selectedLoans?.includes(loan?.id)}
                    onChange={() => handleSelectLoan(loan?.id)}
                    className="w-4 h-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  />
                </div>

                {/* Asset Info */}
                <div className="col-span-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                      <AppIcon name="Package" size={20} className="text-muted-foreground" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{loan?.assetName}</h4>
                      <p className="text-sm text-muted-foreground">{loan?.assetId}</p>
                    </div>
                  </div>
                </div>

                {/* Employee Info */}
                <div className="col-span-2">
                  <div className="flex items-center gap-2">
                    <img
                      src={loan?.employee?.avatar}
                      alt={loan?.employee?.avatarAlt}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-foreground text-sm">{loan?.employee?.name}</p>
                      <p className="text-xs text-muted-foreground">{loan?.employee?.department}</p>
                    </div>
                  </div>
                </div>

                {/* Checkout Date */}
                <div className="col-span-2">
                  <p className="text-sm text-foreground">{formatDate(loan?.checkoutDate)}</p>
                </div>

                {/* Due Date */}
                <div className="col-span-2">
                  <p className={cn("text-sm font-medium", getUrgencyColor(loan))}>
                    {formatDate(loan?.expectedReturnDate)}
                  </p>
                  <p className={cn("text-xs", getUrgencyColor(loan))}>
                    {getDaysRemaining(loan?.expectedReturnDate)}
                  </p>
                </div>

                {/* Status Badge */}
                <div className="col-span-1">
                  <span className={cn(
                    "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border",
                    urgencyBadge?.color
                  )}>
                    {urgencyBadge?.label}
                  </span>
                </div>

                {/* Actions */}
                <div className="col-span-1">
                  <div className="flex items-center gap-1">
                    {isOverdue(loan) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Mail"
                        onClick={() => handleSendReminder(loan)}
                        className="text-warning hover:text-warning"
                      />
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="LogIn"
                      onClick={() => onCheckIn?.(loan)}
                      className="text-primary hover:text-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              {loan?.notes && (
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    <AppIcon name="MessageSquare" size={14} className="inline mr-1" />
                    {loan?.notes}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="text-center text-sm text-muted-foreground pt-4">
        Showing {filteredLoans?.length} of {loans?.length} active loans
      </div>
    </div>
  );
};

export default ActiveLoansPanel;