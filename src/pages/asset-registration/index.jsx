import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '../../lib/supabaseClient';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import { NotificationContainer } from '../../components/ui/NotificationToast';
// We are using these components, but we will update them in the next step to accept the new props!
import AssetDetailsSection from './components/AssetDetailsSection';
import LocationSection from './components/LocationSection';
import FinancialSection from './components/FinancialSection';
import Button from '../../components/ui/Button';

// --- 1. Zod Validation Schema ---
const assetRegistrationSchema = z.object({
  // Asset Details
  product_name: z.string().min(3, "Asset Name is required"),
  category: z.string().min(1, "Category is required"),
  serial_number: z.string().min(3, "Serial Number is required"),
  model: z.string().optional(),
  
  // Location
  current_department_id: z.string().min(1, "Department is required"),
  
  // Financial
  purchase_date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
  purchase_price: z.preprocess((a) => parseFloat(a) || 0, z.number().min(0)),
  warranty_months: z.preprocess((a) => parseInt(a) || 0, z.number().int().min(0)),
  supplier_id: z.string().min(1, "Supplier is required"),
});

const AssetRegistration = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Real Data State
  const [departments, setDepartments] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  // Mock User (Keep for UI consistency)
  const user = { name: "Admin", role: "system_admin", email: "admin@pmma.com" };

  // --- 2. Setup Form Engine ---
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(assetRegistrationSchema),
    defaultValues: { category: 'Laptop', warranty_months: 12 }
  });

  // --- 3. Fetch Real Data from Supabase ---
  useEffect(() => {
    const fetchReferenceData = async () => {
      const { data: depts } = await supabase.from('departments').select('id, name');
      const { data: supps } = await supabase.from('suppliers').select('id, name');
      
      if (depts) setDepartments(depts.map(d => ({ value: d.id.toString(), label: d.name })));
      if (supps) setSuppliers(supps.map(s => ({ value: s.id.toString(), label: s.name })));
    };
    fetchReferenceData();
  }, []);

  // --- 4. Handle Submit ---
const onSubmit = async (formData) => {
        setIsLoading(true);
        // Generate Tag: ISD-LAP-RANDOM
        const asset_tag = `ISD-${formData.category.substring(0,3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

        try {
            const { error } = await supabase.from('assets').insert({
                asset_tag,
                product_name: formData.product_name,
                category: formData.category,
                serial_number: formData.serial_number,
                // model: formData.model,  <-- DELETE THIS LINE (The database doesn't have this column)
                purchase_date: formData.purchase_date,
                purchase_price: formData.purchase_price,
                warranty_months: formData.warranty_months,
                supplier_id: parseInt(formData.supplier_id),
                current_department_id: parseInt(formData.current_department_id),
                status: 'In Use'
            });

            if (error) throw error;

            addNotification(`Success! Asset ${asset_tag} registered.`, 'success');
            reset();
        } catch (error) {
            console.error("Insert Error:", error); // Added log for easier debugging
            addNotification(error.message, 'error');
        } finally {
            setIsLoading(false);
        }
    };

  const addNotification = (message, type) => {
    setNotifications(prev => [...prev, { id: Date.now(), message, type }]);
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
                <h1 className="text-2xl font-bold text-foreground">Register New Asset</h1>
                <p className="text-muted-foreground">Add new equipment to the live database.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* We pass 'register' and 'errors' to your existing components */}
              <AssetDetailsSection register={register} errors={errors} />
              
              <LocationSection 
                register={register} errors={errors} 
                departments={departments} // Pass the real departments
              />
              
              <FinancialSection 
                register={register} errors={errors} 
                suppliers={suppliers} // Pass the real suppliers
              />

              <div className="flex justify-end gap-3 pt-6 border-t">
                 <Button type="submit" isLoading={isLoading}>Register Asset</Button>
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