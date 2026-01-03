import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { supabase } from '../../lib/supabaseClient';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select'; 
import { AlertCircle, UserPlus } from 'lucide-react';

// Layout components
import Sidebar from '../../components/ui/Sidebar';
import Header from '../../components/ui/Header';
import { useSelector } from 'react-redux';

const UserRegistration = () => {
  const { register, handleSubmit, reset, control, formState: { errors, isSubmitting } } = useForm();
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [departments, setDepartments] = useState([]);

  // Get actual user from Redux store
  const { user } = useSelector((state) => state.auth);

  // Fetch departments for the select dropdown
  useEffect(() => {
    const fetchDepartments = async () => {
      const { data, error } = await supabase.from('departments').select('id, name');
      if (error) {
        console.error('Error fetching departments:', error);
      } else {
        setDepartments(data.map(dept => ({ value: dept.id, label: dept.name })));
      }
    };
    fetchDepartments();
  }, []);

  // Define allowed roles for registration
  const roles = [
    { value: 'admin', label: 'System Admin' },
  ];

  const onSubmit = async (data) => {
    setSuccess('');
    setError('');

    try {
      // 1. Create user in Supabase auth.users
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            role: data.role
          }
        }
      });
      
      if (authError) throw authError;

      // 2. Insert corresponding profile entry into 'profiles' table
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          full_name: data.fullName,
          role: data.role,
          email: data.email,
          department_id: parseInt(data.department_id),
        });

      if (profileError) {
        throw profileError;
      }

      setSuccess(`User ${data.email} registered successfully. A confirmation email has been sent.`);
      reset();

    } catch (err) {
      setError(err.message);
      console.error("Registration error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isCollapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} user={user} />
      
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'}`}>
        <Header user={user} />
        
        <main className="pt-16 p-6">
          <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 flex items-center gap-3 text-foreground">
              <UserPlus size={28} /> Admin User Registration
            </h1>
            <p className="text-muted-foreground mb-8">
              Use this form to provision new user accounts and assign their access roles (Admin, IT Staff, or Department PIC) within the system.
            </p>

            {success && (
              <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">{success}</div>
            )}
            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 flex items-center gap-2">
                <AlertCircle size={20} />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-card p-8 rounded-xl shadow-lg border border-border">
              <Input
                label="Full Name"
                type="text"
                placeholder="e.g., John Smith"
                {...register('fullName', { required: 'Full Name is required' })}
                error={errors.fullName?.message}
              />
              <Input
                label="Email (Used for Login)"
                type="email"
                placeholder="user@panasonic.com"
                {...register('email', { required: 'Email is required', pattern: { value: /\S+@\S+$/i, message: 'Invalid email format' } })}
                error={errors.email?.message}
              />
              <Input
                label="Temporary Password"
                type="password"
                placeholder="Min 6 characters"
                {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
                error={errors.password?.message}
              />
              <Controller
                name="role"
                control={control}
                rules={{ required: 'Role assignment is required' }}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Assign Role"
                    options={roles}
                    placeholder="Select a role..."
                    error={errors.role?.message}
                  />
                )}
              />
              <Controller
                name="department_id"
                control={control}
                rules={{ required: 'Department is required' }}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Assign Department"
                    options={departments}
                    placeholder="Select a department..."
                    error={errors.department_id?.message}
                  />
                )}
              />
              <Button 
                type="submit" 
                isLoading={isSubmitting} 
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? 'Registering User...' : 'Register User'}
              </Button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserRegistration;