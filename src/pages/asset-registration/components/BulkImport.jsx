import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { supabase } from '../../../lib/supabaseClient';
import { useSelector } from 'react-redux';
import { logActivity } from '../../../utils/activityLogger';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { useNavigate } from 'react-router-dom';

const BulkImport = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [parsedData, setParsedData] = useState([]);
  const [isParsing, setIsParsing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importResults, setImportResults] = useState(null);
  const { user: authUser } = useSelector((state) => state.auth);
  const userId = authUser?.id;

  const onDrop = useCallback(async (acceptedFiles) => {
    setFiles(acceptedFiles);
    setIsParsing(true);
    setParsedData([]);
    setImportResults(null);

    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const csvData = event.target.result;
      // Basic CSV parsing
      const rows = csvData.split('\n').map(row => row.split(','));
      const headers = rows[0].map(h => h.trim());
      const data = rows.slice(1).map(row => {
        let obj = {};
        headers.forEach((h, i) => {
          obj[h] = row[i]?.trim();
        });
        return obj;
      });
      setParsedData(data);
      setIsParsing(false);
    };

    reader.readAsText(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    multiple: false,
  });
  
  const handleImport = async () => {
    setIsImporting(true);
    setImportResults({ success: 0, failed: 0, errors: [] });

    for (const item of parsedData) {
      // TODO: Validate each item with Zod before inserting

      const asset_tag = `ISD-${item.category?.substring(0,3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

      const { data, error } = await supabase
        .from('assets')
        .insert({
          product_name: item.product_name,
          category: item.category,
          serial_number: item.serial_number,
          model: item.model,
          purchase_date: item.purchase_date,
          purchase_price: parseFloat(item.purchase_price) || 0,
          warranty_months: parseInt(item.warranty_months) || 0,
          supplier_id: parseInt(item.supplier_id),
          lifespan_years: parseInt(item.lifespan_years) || 0,
          current_department_id: parseInt(item.current_department_id),
          status: 'in_storage',
          asset_tag,
        })
        .select()
        .single();
      
      if (error) {
        setImportResults(prev => ({
          ...prev,
          failed: prev.failed + 1,
          errors: [...prev.errors, `Row ${parsedData.indexOf(item) + 2}: ${error.message}`]
        }));
      } else {
        await logActivity(
          'asset_added',
          `Added new asset via bulk import: ${item.product_name} (${asset_tag})`,
          data.id,
          userId,
          { source: 'bulk_import' }
        );
        setImportResults(prev => ({ ...prev, success: prev.success + 1 }));
      }
    }
    setIsImporting(false);
  };

  return (
    <div>
      {/* Dropzone UI */}
      <div {...getRootProps()} className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-colors ${isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
        <input {...getInputProps()} />
        <div className="space-y-4">
          <Icon name="UploadCloud" size={48} className="mx-auto text-muted-foreground" />
          <div>
            <p className="text-foreground font-medium">
              {isParsing ? 'Parsing...' : 'Drop CSV file here or click to browse'}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Only *.csv files are accepted.
            </p>
          </div>
        </div>
      </div>
      
      <div className="text-center mt-4">
        <Button 
          variant="link" 
          onClick={() => navigate('/bulk-import-template')}
        >
          Download CSV Template
        </Button>
      </div>

      {/* Preview and Import */}
      {parsedData.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Preview Data ({parsedData.length} rows)</h3>
          <div className="mt-4 max-h-60 overflow-auto border rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-muted sticky top-0">
                <tr>
                  {Object.keys(parsedData[0]).map(key => (
                    <th key={key} className="p-2 text-left">{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {parsedData.slice(0, 5).map((row, i) => (
                  <tr key={i}>
                    {Object.values(row).map((val, j) => (
                      <td key={j} className="p-2 truncate">{val}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 flex justify-end">
            <Button onClick={handleImport} loading={isImporting}>
              Import {parsedData.length} Assets
            </Button>
          </div>
        </div>
      )}
      
      {/* Import Results */}
      {importResults && (
         <div className="mt-6 p-4 bg-muted/50 rounded-lg">
           <h3 className="font-semibold">Import Complete</h3>
           <p className="text-success">{importResults.success} rows successfully imported.</p>
           <p className="text-error">{importResults.failed} rows failed.</p>
           {importResults.errors.length > 0 && (
             <div className="mt-2 text-xs text-error">
               <h4 className="font-bold">Errors:</h4>
               <ul className="list-disc list-inside">
                 {importResults.errors.slice(0, 10).map((err, i) => (
                   <li key={i}>{err}</li>
                 ))}
               </ul>
               {importResults.errors.length > 10 && <p>...</p>}
             </div>
           )}
         </div>
      )}
    </div>
  );
};

export default BulkImport;
