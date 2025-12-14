import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '../../lib/supabaseClient'; 
import Header from '../../components/ui/Header';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import NotificationToast from '../../components/ui/NotificationToast';

// --- Zod Validation Schema ---
const userRegistrationSchema = z.object({
    email: z.string().email({ message: "Invalid email address format." }).max(255),
    password: z.string().min(8, { message: "Password must be at least 8 characters for security." }),
    full_name: z.string().min(2, { message: "Full name is required." }),
    role: z.enum(['system_admin', 'it_staff', 'department_pic'], { 
        errorMap: () => ({ message: "Please select a valid user role." })
    }),
    // Use string for React Hook Form, but validation ensures it's not empty
    department_id: z.string().min(1, { message: "Department selection is required." }), 
});

const UserRegistration = () => {
    const [departments, setDepartments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });

    // Fetch the list of departments for the dropdown
    useEffect(() => {
        const fetchDepartments = async () => {
            // RLS for 'departments' allows all authenticated users to view this list
            const { data, error } = await supabase.from('departments').select('id, name').order('name');
            if (error) {
                console.error('Error fetching departments:', error);
                setToast({ show: true, message: 'Failed to load departments.', type: 'error' });
            } else {
                setDepartments(data.map(d => ({ value: d.id.toString(), label: d.name })));
            }
        };
        fetchDepartments();
    }, []);

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(userRegistrationSchema),
        defaultValues: {
            email: '',
            password: '',
            full_name: '',
            role: '',
            department_id: '',
        }
    });

    const onSubmit = async (formData) => {
        setIsLoading(true);
        setToast({ show: false, message: '', type: '' });
        let authUserId = null;

        try {
            // 1. Create the user in Supabase Auth (auth.users table)
            const { data: { user: authUser }, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password, 
            });

            if (authError) {
                // Handle duplicate email, weak password, etc.
                throw new Error(authError.message);
            }
            
            authUserId = authUser.id; // Store ID for potential rollback

            // 2. Insert user profile data into the custom 'profiles' table
            // This will only work if the current user has the 'system_admin' role due to RLS Policy 3 defined in Step 1.
            const { error: profileError } = await supabase
                .from('profiles')
                .insert({
                    id: authUserId,
                    full_name: formData.full_name,
                    role: formData.role,
                    // Convert the string department_id back to an integer for PostgreSQL
                    department_id: parseInt(formData.department_id, 10),
                });

            if (profileError) {
                // CRITICAL: Rollback the Auth user if profile data fails to save!
                // Using Supabase Admin API for secure rollback (assuming this is client-side in a secure context/function)
                // NOTE: For a production app, the whole transaction should be done via a Supabase Function/RPC for security. 
                // However, for this project scope, we use a client-side rollback attempt.
                await supabase.auth.admin.deleteUser(authUserId);
                throw new Error(`Profile creation failed. Auth user rolled back. ${profileError.message}`);
            }

            setToast({ 
                show: true, 
                message: `User ${formData.full_name} registered successfully as ${formData.role}.`, 
                type: 'success' 
            });
            reset(); // Clear the form

        } catch (error) {
            setToast({ show: true, message: `Registration Failed: ${error.message}`, type: 'error' });
            console.error("User Registration Error:", error);
        } finally {
            setIsLoading(false);
        }
    };
    const handleDeleteUser = async (userIdToDelete) => {
        if (!window.confirm("Are you sure? This action cannot be undone.")) return;
        
        // OLD CODE (Likely causing the error):
        // await supabase.auth.admin.deleteUser(userIdToDelete); <--- This fails on client
        // OR
        // await supabase.from('profiles').delete().eq('id', userIdToDelete); <--- This leaves the Auth account orphaned

        // NEW CODE: Call the RPC function we just created
        const { error } = await supabase.rpc('delete_user_by_admin', { 
            user_id_to_delete: userIdToDelete 
        });

        if (error) {
            console.error("Error deleting user:", error);
            alert(`Failed to delete user: ${error.message}`);
        } else {
            alert("User deleted successfully.");
            // Refresh your list
            // fetchUsers(); 
        }
    };

    const roleOptions = [
        { value: 'system_admin', label: 'System Admin' },
        { value: 'it_staff', label: 'IT Staff' },
        { value: 'department_pic', label: 'Department PIC' },
    ];

    return (
        <div className="p-6 space-y-6">
            <Header title="User Management" subtitle="System Admin: Create and assign roles for all application users." />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl bg-white p-8 shadow-lg rounded-xl">
                <h3 className="text-xl font-semibold text-gray-800 border-b pb-3 mb-4">Register New User Account</h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Full Name */}
                    <Input
                        id="full_name"
                        label="Full Name"
                        type="text"
                        placeholder="e.g., Akif Fahmi"
                        {...register('full_name')}
                        error={errors.full_name?.message}
                    />

                    {/* Email */}
                    <Input
                        id="email"
                        label="Email Address (Login ID)"
                        type="email"
                        placeholder="user@pmma.com.my"
                        {...register('email')}
                        error={errors.email?.message}
                    />

                    {/* Temporary Password */}
                    <Input
                        id="password"
                        label="Temporary Password"
                        type="password"
                        placeholder="Min 8 characters"
                        {...register('password')}
                        error={errors.password?.message}
                    />

                    {/* Role Selection */}
                    <Select
                        id="role"
                        label="System Role"
                        options={roleOptions}
                        {...register('role')}
                        error={errors.role?.message}
                        placeholder="Select Role..."
                    />

                    {/* Department Selection */}
                    <Select
                        id="department_id"
                        label="Assigned Department"
                        options={departments} 
                        {...register('department_id')}
                        error={errors.department_id?.message}
                        disabled={departments.length === 0 || isLoading}
                        placeholder={departments.length > 0 ? "Select Department..." : "Loading Departments..."}
                    />
                </div>

                <div className="pt-5 border-t border-gray-100 mt-6">
                    <Button 
                        type="submit" 
                        isLoading={isLoading}
                        className="w-full md:w-auto"
                        disabled={departments.length === 0}
                    >
                        {isLoading ? 'Processing...' : 'Register User'}
                    </Button>
                </div>
            </form>

            <NotificationToast 
                show={toast.show} 
                message={toast.message} 
                type={toast.type} 
                onClose={() => setToast({ show: false, message: '', type: '' })}
            />
        </div>
    );
};

export default UserRegistration;