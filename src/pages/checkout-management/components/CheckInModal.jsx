import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import AppIcon from '../../../components/AppIcon';

const CheckInModal = ({ loan, onCheckIn, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      condition: 'good',
      notes: '',
      damageReported: false,
      damageDescription: ''
    }
  });

  const watchDamageReported = watch('damageReported');

  const conditionOptions = [
    { value: 'excellent', label: 'Excellent', description: 'Like new, no visible wear' },
    { value: 'good', label: 'Good', description: 'Minor wear, fully functional' },
    { value: 'fair', label: 'Fair', description: 'Noticeable wear but working' },
    { value: 'poor', label: 'Poor', description: 'Significant wear or damage' }
  ];

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onCheckIn?.(loan?.id, data?.condition, data?.notes, {
        damageReported: data?.damageReported,
        damageDescription: data?.damageDescription
      });
    } catch (error) {
      console.error('Check-in failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysOverdue = () => {
    const today = new Date();
    const dueDate = new Date(loan?.expectedReturnDate);
    const diffTime = today - dueDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const isOverdue = getDaysOverdue() > 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-xl border border-border shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Check In Asset</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Process the return of {loan?.assetName}
            </p>
          </div>
          <Button variant="ghost" size="sm" iconName="X" onClick={onClose} />
        </div>

        {/* Loan Information */}
        <div className="p-6 border-b border-border bg-muted/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Asset Details */}
            <div>
              <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
                <AppIcon name="Package" size={16} />
                Asset Details
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Asset:</span>
                  <span className="font-medium text-foreground">{loan?.assetName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Asset ID:</span>
                  <span className="font-medium text-foreground">{loan?.assetId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category:</span>
                  <span className="font-medium text-foreground">{loan?.assetCategory}</span>
                </div>
              </div>
            </div>

            {/* Employee & Dates */}
            <div>
              <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
                <AppIcon name="User" size={16} />
                Loan Details
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Employee:</span>
                  <span className="font-medium text-foreground">{loan?.employee?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Department:</span>
                  <span className="font-medium text-foreground">{loan?.employee?.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Checked Out:</span>
                  <span className="font-medium text-foreground">{formatDate(loan?.checkoutDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Due Date:</span>
                  <span className={`font-medium ${isOverdue ? 'text-error' : 'text-foreground'}`}>
                    {formatDate(loan?.expectedReturnDate)}
                    {isOverdue && (
                      <span className="text-error text-xs ml-1">
                        ({getDaysOverdue()} days overdue)
                      </span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Overdue Warning */}
          {isOverdue && (
            <div className="mt-4 p-3 bg-error/10 border border-error/20 rounded-lg">
              <div className="flex items-center gap-2 text-error">
                <AppIcon name="AlertTriangle" size={16} />
                <span className="font-medium text-sm">
                  This asset is {getDaysOverdue()} day{getDaysOverdue() !== 1 ? 's' : ''} overdue
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Check-in Form */}
        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Asset Condition */}
            <div>
              <label className="text-sm font-medium text-foreground mb-3 block">
                Asset Condition <span className="text-error">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {conditionOptions?.map(option => (
                  <label
                    key={option?.value}
                    className="flex items-start gap-3 p-3 border border-border rounded-lg cursor-pointer hover:border-primary/30 transition-colors"
                  >
                    <input
                      {...register('condition', { required: 'Please select asset condition' })}
                      type="radio"
                      value={option?.value}
                      className="w-4 h-4 rounded-full border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 mt-0.5"
                    />
                    <div>
                      <div className="font-medium text-foreground text-sm">{option?.label}</div>
                      <div className="text-xs text-muted-foreground">{option?.description}</div>
                    </div>
                  </label>
                ))}
              </div>
              {errors?.condition && (
                <p className="text-sm text-error mt-1">{errors?.condition?.message}</p>
              )}
            </div>

            {/* Damage Reporting */}
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  {...register('damageReported')}
                  type="checkbox"
                  className="w-4 h-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
                <div>
                  <span className="text-sm font-medium text-foreground">Report damage or issues</span>
                  <p className="text-xs text-muted-foreground">Check this if the asset has any damage or problems</p>
                </div>
              </label>
            </div>

            {/* Damage Description (conditional) */}
            {watchDamageReported && (
              <div>
                <Input
                  {...register('damageDescription', {
                    required: watchDamageReported ? 'Please describe the damage' : false
                  })}
                  label="Damage Description"
                  placeholder="Describe the damage or issues found..."
                  error={errors?.damageDescription?.message}
                  required={watchDamageReported}
                />
              </div>
            )}

            {/* Return Notes */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Return Notes (Optional)
              </label>
              <textarea
                {...register('notes')}
                placeholder="Add any additional notes about the return..."
                rows={3}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-4">
              <Button
                type="submit"
                loading={isSubmitting}
                disabled={!isValid || isSubmitting}
                iconName="Check"
                iconPosition="left"
                className="flex-1"
              >
                {isSubmitting ? 'Processing Check-in...' : 'Complete Check-in'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckInModal;