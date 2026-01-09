import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const Breadcrumb = ({ asset }) => {
  const navigate = useNavigate();

  const breadcrumbItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Asset List', path: '/asset-list' },
    { label: asset?.product_name || 'Asset Details', path: null }
  ];

  return (
    <nav className="flex items-center space-x-2 mb-6" aria-label="Breadcrumb">
      {breadcrumbItems?.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
          )}
          {item?.path ? (
            <Button
              variant="ghost"
              onClick={() => navigate(item?.path)}
              className="text-muted-foreground hover:text-foreground px-2 py-1 h-auto text-sm"
            >
              {item?.label}
            </Button>
          ) : (
            <span className="text-foreground font-medium text-sm px-2">
              {item?.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;