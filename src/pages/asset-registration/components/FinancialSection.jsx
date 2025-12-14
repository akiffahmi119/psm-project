import React from 'react';
import Icon from '../../../components/AppIcon';

const FinancialSection = ({ register, errors, suppliers = [] }) => {
  // Helper class for consistent input styling
  const inputClass = "w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Icon name="DollarSign" size={20} className="text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Financial Information</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Supplier Dropdown (Real Data) */}
        <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
              Supplier <span className="text-red-500">*</span>
            </label>
            <select 
              {...register("supplier_id")} 
              className={inputClass}
            >
                <option value="">Select Supplier</option>
                {suppliers.map(sup => (
                    <option key={sup.value} value={sup.value}>{sup.label}</option>
                ))}
            </select>
            {errors.supplier_id && (
              <p className="text-xs text-red-500 font-medium">{errors.supplier_id.message}</p>
            )}
        </div>

        {/* Purchase Price */}
        <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Purchase Price (MYR)</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-muted-foreground text-sm">RM</span>
              <input 
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register("purchase_price")} 
                  className={`${inputClass} pl-9`} // Add padding for "RM"
              />
            </div>
            {errors.purchase_price && <p className="text-xs text-red-500">{errors.purchase_price.message}</p>}
        </div>

        {/* Purchase Date */}
        <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Purchase Date</label>
            <input 
                type="date"
                {...register("purchase_date")} 
                className={inputClass}
            />
            {errors.purchase_date && <p className="text-xs text-red-500">{errors.purchase_date.message}</p>}
        </div>

        {/* Warranty (Simplified to Months) */}
        <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Warranty (Months)</label>
            <input 
                type="number"
                placeholder="e.g. 12 or 24"
                {...register("warranty_months")} 
                className={inputClass}
            />
             <p className="text-xs text-muted-foreground">Enter 0 if no warranty.</p>
        </div>
      </div>
    </div>
  );
};

export default FinancialSection;