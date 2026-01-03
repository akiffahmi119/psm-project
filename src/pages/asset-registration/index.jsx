import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '../../lib/supabaseClient';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import { NotificationContainer } from '../../components/ui/NotificationToast';
import AssetDetailsSection from './components/AssetDetailsSection';
import LocationSection from './components/LocationSection';
import FinancialSection from './components/FinancialSection';
import ImageUpload from './components/ImageUpload';
import Button from '../../components/ui/Button';

// --- 1. Zod Validation Schema ---
const assetRegistrationSchema = z.object({
  product_name: z.string().min(3, "Asset Name is required"),
  category: z.string().min(1, "Category is required"),
  serial_number: z.string().min(3, "Serial Number is required"),
  model: z.string().optional(),
  current_department_id: z.string().min(1, "Department is required"),
  purchase_date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
  purchase_price: z.preprocess((a) => parseFloat(String(a)) || 0, z.number().min(0)),
  warranty_months: z.preprocess((a) => parseInt(String(a)) || 0, z.number().int().min(0)),
  supplier_id: z.string().min(1, "Supplier is required"),
  image_url: z.string().optional(),
});

const AssetRegistration = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const assetId = searchParams.get('id');
  const isEditMode = assetId !== null;

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);

  const user = { name: "Admin", role: "system_admin", email: "admin@pmma.com" };

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(assetRegistrationSchema),
    defaultValues: { category: 'Laptop', warranty_months: 12 }
  });

  // --- Fetch Reference Data & Asset Data for Editing ---
  useEffect(() => {
                                    const fetchReferenceData = async () => {
                                      const { data: depts, error: deptsError } = await supabase.from('departments').select('id, name');
                                      const { data: supps, error: suppsError } = await supabase.from('suppliers').select('id, company_name');
                                      if (deptsError) console.error("Error fetching departments:", deptsError);
      if (suppsError) console.error("Error fetching suppliers:", suppsError);

      console.log("Raw departments data from Supabase:", depts);
      console.log("Raw suppliers data from Supabase:", supps);
      if (depts) {
        const processedDepts = depts.map(d => ({ value: d.id.toString(), label: d.name }));
        setDepartments(processedDepts);
        console.log("Processed departments for dropdown:", processedDepts);
      }
                                      if (supps) {
        const processedSupps = supps.map(s => ({ value: s.id.toString(), label: s.company_name }));
        setSuppliers(processedSupps);
        console.log("Processed suppliers for dropdown:", processedSupps);
      }
                                    };

    const fetchAssetForEdit = async () => {
      if (!isEditMode) return;
      setIsLoading(true);
      try {
        const { data, error } = await supabase.from('assets').select('*').eq('id', assetId).single();
        if (error) throw error;
        if (data) {
          // Format purchase_date for the date input (YYYY-MM-DD)
          const formattedData = {
            ...data,
            purchase_date: data.purchase_date ? new Date(data.purchase_date).toISOString().split('T')[0] : '',
            current_department_id: String(data.current_department_id),
            supplier_id: String(data.supplier_id),
          };
          reset(formattedData);
          if (data.image_url) {
            setImageUrl(data.image_url);
            setValue('image_url', data.image_url);
          }
        }
      } catch (error) {
        console.error("Error fetching asset for edit:", error);
        addNotification('Failed to load asset data.', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReferenceData();
    fetchAssetForEdit();
  }, [assetId, isEditMode, reset, setValue]);

  const addNotification = (message, type) => {
    setNotifications(prev => [...prev, { id: Date.now(), message, type }]);
  };
  
  const handleImageUpload = (url) => {
    setImageUrl(url);
    setValue('image_url', url);
  };

  // --- Handle Form Submit (Create or Update) ---
  const onSubmit = async (formData) => {
    setIsLoading(true);

    const assetData = {
      product_name: formData.product_name,
      category: formData.category,
      serial_number: formData.serial_number,
      purchase_date: formData.purchase_date,
      purchase_price: formData.purchase_price,
      warranty_months: formData.warranty_months,
      supplier_id: parseInt(formData.supplier_id),
      current_department_id: parseInt(formData.current_department_id),
      status: 'In Use', // Default status
      image_url: formData.image_url,
    };

    try {
      if (isEditMode) {
        // --- UPDATE ---
        const { error } = await supabase.from('assets').update(assetData).eq('id', assetId);
        if (error) throw error;
        navigate('/asset-list', { state: { message: 'Asset details updated successfully!' } });
      } else {
        // --- INSERT ---
        const asset_tag = `ISD-${formData.category.substring(0,3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
        const { error } = await supabase.from('assets').insert({ ...assetData, asset_tag });
        if (error) throw error;
        addNotification(`Success! Asset ${asset_tag} registered.`, 'success');
        reset();
        setImageUrl(null);
      }
    } catch (error) {
      console.error("Submission Error:", error);
      addNotification(error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isCollapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} user={user} />
      
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'}`}>
        <Header user={user} />
        
        <main className="pt-16 p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">{isEditMode ? 'Edit Asset' : 'Register New Asset'}</h1>
                <p className="text-muted-foreground">{isEditMode ? 'Update the details of the existing asset.' : 'Add new equipment to the live database.'}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <AssetDetailsSection register={register} errors={errors} />
              
              <LocationSection 
                register={register} errors={errors} 
                departments={departments}
              />
              
              <FinancialSection 
                register={register} errors={errors} 
                suppliers={suppliers}
              />

              <ImageUpload onUpload={handleImageUpload} initialImageUrl={imageUrl} />

              <div className="flex justify-end gap-3 pt-6 border-t">
                 <Button type="button" variant="outline" onClick={() => navigate('/asset-list')}>Cancel</Button>
                 <Button type="submit" isLoading={isLoading}>{isEditMode ? 'Save Changes' : 'Register Asset'}</Button>
              </div>
            </form>
          </div>
        </main>
      </div>
      <NotificationContainer notifications={notifications} onRemove={(id) => setNotifications(prev => prev.filter(n => n.id !== id))} />
    </div>
  );
};

export default AssetRegistration;