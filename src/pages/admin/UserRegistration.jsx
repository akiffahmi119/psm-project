// src/pages/admin/UserRegistration.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '../../supabaseClient';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select'; 
import { AlertCircle, UserPlus } from 'lucide-react';

const UserRegistration = () => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Define allowed roles for registration
  const roles = [
    { value: 'admin', label: 'System Admin' },
    { value: 'it_staff', label: 'IT Staff' },
    { value: 'department_pic', label: 'Department PIC' },
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
            role: data.role // Pass role to the user metadata (optional, but useful)
          }
        }
      });
      
      if (authError) throw authError;

      // 2. Insert corresponding profile entry into 'profiles' table (needed for RLS)
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          full_name: data.fullName,
          role: data.role,
          email: data.email,
        });

      if (profileError) {
        // NOTE: If profile insertion fails, you may want to delete the user created in Step 1
        console.error("Profile insertion failed, manual cleanup may be required:", profileError.message);
        throw new Error("User created, but profile failed. Contact support.");
      }

      setSuccess(`User ${data.email} registered successfully with role: ${data.role}. A confirmation email has been sent.`);
      reset();

    } catch (err) {
      setError(err.message);
      console.error("Registration error:", err);
    }
  };

  return (
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
        {/* Full Name */}
        <Input
          label="Full Name"
          type="text"
          placeholder="e.g., John Smith"
          {...register('fullName', { required: 'Full Name is required' })}
          error={errors.fullName?.message}
        />

        {/* Email */}
        <Input
          label="Email (Used for Login)"
          type="email"
          placeholder="user@panasonic.com"
          {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email format' } })}
          error={errors.email?.message}
        />

        {/* Password */}
        <Input
          label="Temporary Password"
          type="password"
          placeholder="Min 6 characters"
          {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
          error={errors.password?.message}
        />

        {/* Role Selection */}
        <Select
          label="Assign Role"
          options={roles}
          {...register('role', { required: 'Role assignment is required' })}
          error={errors.role?.message}
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
  );
};

export default UserRegistration;