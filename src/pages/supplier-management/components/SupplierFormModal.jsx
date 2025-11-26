import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { cn } from '../../../utils/cn';

const SupplierFormModal = ({ isOpen, onClose, supplier, onSubmit }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    taxId: '',
    category: '',
    paymentTerms: '',
    contractStart: '',
    contractEnd: '',
    status: 'active',
    rating: 4.0,
    preferredVendor: false,
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'Hardware',
    'Software',
    'Networking',
    'Office Supplies',
    'Cloud Services',
    'Security',
    'Telecommunications',
    'Furniture',
    'Other'
  ];

  const paymentTermsOptions = [
    'Net 15',
    'Net 30',
    'Net 45',
    'Net 60',
    'COD',
    'Prepaid'
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'pending', label: 'Pending' },
    { value: 'inactive', label: 'Inactive' }
  ];

  useEffect(() => {
    if (supplier) {
      setFormData({
        companyName: supplier?.companyName || '',
        contactPerson: supplier?.contactPerson || '',
        email: supplier?.email || '',
        phone: supplier?.phone || '',
        address: supplier?.address || '',
        website: supplier?.website || '',
        taxId: supplier?.taxId || '',
        category: supplier?.category || '',
        paymentTerms: supplier?.paymentTerms || '',
        contractStart: supplier?.contractStart || '',
        contractEnd: supplier?.contractEnd || '',
        status: supplier?.status || 'active',
        rating: supplier?.rating || 4.0,
        preferredVendor: supplier?.preferredVendor || false,
        notes: supplier?.notes || ''
      });
    } else {
      setFormData({
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        address: '',
        website: '',
        taxId: '',
        category: '',
        paymentTerms: '',
        contractStart: '',
        contractEnd: '',
        status: 'active',
        rating: 4.0,
        preferredVendor: false,
        notes: ''
      });
    }
    setErrors({});
  }, [supplier, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.companyName?.trim()) {
      newErrors.companyName = 'Company name is required';
    }

    if (!formData?.contactPerson?.trim()) {
      newErrors.contactPerson = 'Contact person is required';
    }

    if (!formData?.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData?.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData?.category) {
      newErrors.category = 'Category is required';
    }

    if (formData?.website && !/^https?:\/\/.+/?.test(formData?.website)) {
      newErrors.website = 'Please enter a valid website URL (include http:// or https://)';
    }

    if (formData?.contractStart && formData?.contractEnd) {
      const startDate = new Date(formData?.contractStart);
      const endDate = new Date(formData?.contractEnd);
      if (endDate <= startDate) {
        newErrors.contractEnd = 'Contract end date must be after start date';
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors)?.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      onSubmit(formData);
    } catch (error) {
      setErrors({ general: 'Failed to save supplier. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field) => (e) => {
    const value = e?.target?.type === 'checkbox' ? e?.target?.checked : e?.target?.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear field error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-foreground">
            {supplier ? 'Edit Supplier' : 'Add New Supplier'}
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {errors?.general && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-destructive text-sm">{errors?.general}</p>
              </div>
            )}

            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-medium text-foreground mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Company Name"
                  value={formData?.companyName}
                  onChange={handleInputChange('companyName')}
                  error={errors?.companyName}
                  required
                  disabled={isSubmitting}
                />
                <Input
                  label="Contact Person"
                  value={formData?.contactPerson}
                  onChange={handleInputChange('contactPerson')}
                  error={errors?.contactPerson}
                  required
                  disabled={isSubmitting}
                />
                <Input
                  label="Email"
                  type="email"
                  value={formData?.email}
                  onChange={handleInputChange('email')}
                  error={errors?.email}
                  required
                  disabled={isSubmitting}
                />
                <Input
                  label="Phone"
                  type="tel"
                  value={formData?.phone}
                  onChange={handleInputChange('phone')}
                  error={errors?.phone}
                  required
                  disabled={isSubmitting}
                />
                <div className="md:col-span-2">
                  <Input
                    label="Address"
                    value={formData?.address}
                    onChange={handleInputChange('address')}
                    error={errors?.address}
                    disabled={isSubmitting}
                  />
                </div>
                <Input
                  label="Website"
                  type="url"
                  value={formData?.website}
                  onChange={handleInputChange('website')}
                  error={errors?.website}
                  placeholder="https://example.com"
                  disabled={isSubmitting}
                />
                <Input
                  label="Tax ID"
                  value={formData?.taxId}
                  onChange={handleInputChange('taxId')}
                  error={errors?.taxId}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Business Details */}
            <div>
              <h3 className="text-lg font-medium text-foreground mb-4">Business Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Category <span className="text-destructive">*</span>
                  </label>
                  <select
                    value={formData?.category}
                    onChange={handleInputChange('category')}
                    className={cn(
                      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                      errors?.category && "border-destructive focus-visible:ring-destructive"
                    )}
                    disabled={isSubmitting}
                  >
                    <option value="">Select category</option>
                    {categories?.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  {errors?.category && (
                    <p className="text-sm text-destructive mt-1">{errors?.category}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Payment Terms</label>
                  <select
                    value={formData?.paymentTerms}
                    onChange={handleInputChange('paymentTerms')}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    <option value="">Select payment terms</option>
                    {paymentTermsOptions?.map(term => (
                      <option key={term} value={term}>{term}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Status</label>
                  <select
                    value={formData?.status}
                    onChange={handleInputChange('status')}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    {statusOptions?.map(status => (
                      <option key={status?.value} value={status?.value}>{status?.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Rating</label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.1"
                    value={formData?.rating}
                    onChange={handleInputChange('rating')}
                    className="w-full"
                    disabled={isSubmitting}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>1.0</span>
                    <span className="font-medium">{formData?.rating}</span>
                    <span>5.0</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contract Information */}
            <div>
              <h3 className="text-lg font-medium text-foreground mb-4">Contract Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Contract Start Date"
                  type="date"
                  value={formData?.contractStart}
                  onChange={handleInputChange('contractStart')}
                  error={errors?.contractStart}
                  disabled={isSubmitting}
                />
                <Input
                  label="Contract End Date"
                  type="date"
                  value={formData?.contractEnd}
                  onChange={handleInputChange('contractEnd')}
                  error={errors?.contractEnd}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Additional Options */}
            <div>
              <h3 className="text-lg font-medium text-foreground mb-4">Additional Options</h3>
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData?.preferredVendor}
                    onChange={handleInputChange('preferredVendor')}
                    className="w-4 h-4 rounded border border-input text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    disabled={isSubmitting}
                  />
                  <span className="text-sm font-medium text-foreground">Preferred Vendor</span>
                </label>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Notes</label>
                  <textarea
                    value={formData?.notes}
                    onChange={handleInputChange('notes')}
                    rows={3}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                    placeholder="Additional notes about this supplier..."
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-muted/25">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={isSubmitting}
            disabled={isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? 'Saving...' : (supplier ? 'Update Supplier' : 'Add Supplier')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SupplierFormModal;