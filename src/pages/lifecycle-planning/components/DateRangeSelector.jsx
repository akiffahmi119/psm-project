import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const DateRangeSelector = ({ onDateRangeChange, selectedRange }) => {
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [showCustomRange, setShowCustomRange] = useState(false);

  const predefinedRanges = [
    { value: '3months', label: 'Next 3 Months' },
    { value: '6months', label: 'Next 6 Months' },
    { value: '1year', label: 'Next 12 Months' },
    { value: '2years', label: 'Next 24 Months' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const handleRangeChange = (value) => {
    if (value === 'custom') {
      setShowCustomRange(true);
    } else {
      setShowCustomRange(false);
      const today = new Date();
      let endDate = new Date();
      
      switch (value) {
        case '3months':
          endDate?.setMonth(today?.getMonth() + 3);
          break;
        case '6months':
          endDate?.setMonth(today?.getMonth() + 6);
          break;
        case '1year':
          endDate?.setFullYear(today?.getFullYear() + 1);
          break;
        case '2years':
          endDate?.setFullYear(today?.getFullYear() + 2);
          break;
        default:
          endDate?.setMonth(today?.getMonth() + 6);
      }
      
      onDateRangeChange({
        startDate: today?.toISOString()?.split('T')?.[0],
        endDate: endDate?.toISOString()?.split('T')?.[0],
        range: value
      });
    }
  };

  const handleCustomRangeApply = () => {
    if (customStartDate && customEndDate) {
      onDateRangeChange({
        startDate: customStartDate,
        endDate: customEndDate,
        range: 'custom'
      });
      setShowCustomRange(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center space-x-2">
          <Icon name="Calendar" size={20} className="text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Planning Period:</span>
        </div>
        
        <div className="flex-1 max-w-xs">
          <Select
            options={predefinedRanges}
            value={selectedRange?.range || '6months'}
            onChange={handleRangeChange}
            placeholder="Select time range"
          />
        </div>

        {showCustomRange && (
          <div className="flex items-center space-x-2">
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e?.target?.value)}
              className="px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <span className="text-muted-foreground">to</span>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e?.target?.value)}
              className="px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button
              variant="default"
              size="sm"
              onClick={handleCustomRangeApply}
              iconName="Check"
            >
              Apply
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DateRangeSelector;