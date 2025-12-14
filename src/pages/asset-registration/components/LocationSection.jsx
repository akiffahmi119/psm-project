import React from 'react';
import Icon from '../../../components/AppIcon';

const LocationSection = ({ register, errors, departments = [] }) => {
  // Helper class for consistent input styling
  const inputClass = "w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Icon name="MapPin" size={20} className="text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Location & Assignment</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Department Dropdown (Connected to Real DB Data) */}
        <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Department <span className="text-red-500">*</span>
            </label>
            <select 
              {...register("current_department_id")} 
              className={inputClass}
            >
                <option value="">Select Department</option>
                {departments.map(dept => (
                    <option key={dept.value} value={dept.value}>{dept.label}</option>
                ))}
            </select>
            <p className="text-xs text-muted-foreground">The department responsible for this asset.</p>
            {errors.current_department_id && (
              <p className="text-xs text-red-500 font-medium">{errors.current_department_id.message}</p>
            )}
        </div>
      </div>
    </div>
  );
};

export default LocationSection;