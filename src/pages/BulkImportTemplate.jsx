import React from 'react';
import Button from '../components/ui/Button';
import Icon from '../components/AppIcon';

const BulkImportTemplate = () => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/bulk_import_template.csv';
    link.setAttribute('download', 'bulk_import_template.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Bulk Import CSV Template</h1>
          <p className="text-muted-foreground">Download the CSV template to ensure your data is in the correct format for bulk import.</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-4">
          <Icon name="FileText" size={48} className="text-primary" />
          <div>
            <h3 className="text-lg font-semibold">CSV Template</h3>
            <p className="text-muted-foreground mt-1">
              The CSV file must have the following columns in this specific order:
            </p>
            <ul className="list-disc list-inside mt-2 text-sm text-muted-foreground">
              <li>product_name</li>
              <li>category</li>
              <li>serial_number</li>
              <li>model</li>
              <li>purchase_date (YYYY-MM-DD)</li>
              <li>purchase_price (e.g., 1200.50)</li>
              <li>warranty_months (e.g., 12)</li>
              <li>supplier_id (must be a valid ID from the suppliers table)</li>
              <li>lifespan_years (e.g., 5)</li>
              <li>current_department_id (must be a valid ID from the departments table)</li>
            </ul>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button onClick={handleDownload} iconName="Download">
            Download Template
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BulkImportTemplate;
