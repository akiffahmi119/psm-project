import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const AssetTabs = ({ children, defaultTab = 'details' }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const tabs = [
    { id: 'details', label: 'Details', icon: 'Info' },
    { id: 'maintenance', label: 'Maintenance History', icon: 'Wrench' },
    { id: 'attachments', label: 'Attachments', icon: 'Paperclip' },
    { id: 'audit', label: 'Audit Trail', icon: 'History' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Tab Navigation */}
      <div className="border-b border-border">
        <nav className="flex overflow-x-auto">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`
                flex items-center space-x-2 px-4 py-3 text-sm font-medium whitespace-nowrap
                border-b-2 transition-colors duration-200
                ${activeTab === tab?.id
                  ? 'border-primary text-primary bg-primary/5' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                }
              `}
            >
              <Icon name={tab?.icon} size={16} />
              <span>{tab?.label}</span>
            </button>
          ))}
        </nav>
      </div>
      {/* Tab Content */}
      <div className="p-6">
        {React.Children?.map(children, (child) => {
          if (React.isValidElement(child) && child?.props?.tabId === activeTab) {
            return child;
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default AssetTabs;