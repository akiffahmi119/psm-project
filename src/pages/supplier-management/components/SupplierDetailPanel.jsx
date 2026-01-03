import React from 'react';
import { Building2, User, Mail, Phone, Globe, Star, MapPin, FileText, Award, Clock, TrendingUp } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { cn } from '../../../utils/cn';

const SupplierDetailPanel = ({ supplier, onEdit }) => {
  const formatCurrency = (value) => {
    if (!value) return '$0';
    return value;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString)?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-success/10 text-success border-success/20',
      pending: 'bg-warning/10 text-warning border-warning/20',
      inactive: 'bg-muted text-muted-foreground border-muted'
    };
    return colors?.[status] || colors?.inactive;
  };

  const renderRating = (rating) => {
    const stars = Array?.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={cn(
          "w-4 h-4",
          index < Math?.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
        )}
      />
    ));
    return (
      <div className="flex items-center gap-1">
        {stars}
        <span className="text-sm text-muted-foreground ml-2">({rating}/5.0)</span>
      </div>
    );
  };

  const getContractStatus = () => {
    if (!supplier?.contract_end) return { status: 'No Contract', color: 'text-muted-foreground' };
    
    const endDate = new Date(supplier?.contract_end);
    const today = new Date();
    const diffTime = endDate - today;
    const diffDays = Math?.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { status: 'Expired', color: 'text-destructive' };
    } else if (diffDays <= 30) {
      return { status: `Expires in ${diffDays} days`, color: 'text-warning' };
    } else {
      return { status: 'Active', color: 'text-success' };
    }
  };

  if (!supplier) {
    return (
      <div className="bg-card border rounded-lg p-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
            <Building2 className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No Supplier Selected</h3>
            <p className="text-muted-foreground">
              Select a supplier from the table to view detailed information and manage their profile.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const contractStatus = getContractStatus();

  return (
    <div className="bg-card border rounded-lg">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {supplier?.image_url && (
              <img
                src={supplier?.image_url}
                alt={`${supplier?.company_name} building`}
                className="w-16 h-16 rounded-lg object-cover"
              />
            )}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-foreground">{supplier?.company_name}</h2>
                {supplier?.preferred_vendor && (
                  <Award className="w-5 h-5 text-primary" title="Preferred Vendor" />
                )}
              </div>
              <span
                className={cn(
                  "inline-flex px-2 py-1 rounded-md text-xs font-medium border capitalize",
                  getStatusColor(supplier?.status)
                )}
              >
                {supplier?.status}
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            iconName="Edit"
            onClick={() => onEdit(supplier)}
          >
            Edit
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Contact Information */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <User className="w-4 h-4" />
            Contact Information
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">{supplier?.contact_person}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <a
                href={`mailto:${supplier?.email}`}
                className="text-primary hover:text-primary/80 transition-colors"
              >
                {supplier?.email}
              </a>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <a
                href={`tel:${supplier?.phone}`}
                className="text-primary hover:text-primary/80 transition-colors"
              >
                {supplier?.phone}
              </a>
            </div>
            {supplier?.website && (
              <div className="flex items-center gap-3 text-sm">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <a
                  href={supplier?.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  {supplier?.website}
                </a>
              </div>
            )}
            {supplier?.address && (
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                <span className="text-muted-foreground">{supplier?.address}</span>
              </div>
            )}
          </div>
        </div>

        {/* Performance Metrics */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Performance Metrics
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Rating</span>
              {renderRating(supplier?.rating)}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Orders</span>
              <span className="text-sm font-medium">{supplier?.total_orders}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Value</span>
              <span className="text-sm font-medium">{formatCurrency(supplier?.total_value)}</span>
            </div>
          </div>
        </div>

        {/* Contract Information */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Contract Details
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <span className={cn("text-sm font-medium", contractStatus?.color)}>
                {contractStatus?.status}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Start Date</span>
              <span className="text-sm font-medium">{formatDate(supplier?.contract_start)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">End Date</span>
              <span className="text-sm font-medium">{formatDate(supplier?.contract_end)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Payment Terms</span>
              <span className="text-sm font-medium">{supplier?.payment_terms}</span>
            </div>
            {supplier?.tax_id && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Tax ID</span>
                <span className="text-sm font-medium">{supplier?.tax_id}</span>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Recent Activity
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Last Interaction</span>
            <span className="text-sm font-medium">{formatDate(supplier?.last_interaction)}</span>
          </div>
        </div>

        {/* Notes */}
        {supplier?.notes && (
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Notes</h3>
            <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
              {supplier?.notes}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 pt-4 border-t">
          <Button
            variant="outline"
            fullWidth
            iconName="Mail"
            iconPosition="left"
          >
            Send Email
          </Button>
          <Button
            variant="outline"
            fullWidth
            iconName="Phone"
            iconPosition="left"
          >
            Call Supplier
          </Button>
          <Button
            variant="outline"
            fullWidth
            iconName="FileText"
            iconPosition="left"
          >
            View Contract
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SupplierDetailPanel;