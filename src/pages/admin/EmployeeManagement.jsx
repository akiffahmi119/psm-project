// src/pages/admin/EmployeeManagement.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '../../lib/supabaseClient';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { Controller } from 'react-hook-form';
import { AlertCircle, UserPlus, Users, Edit, Trash2 } from 'lucide-react'; // Added Edit and Trash2 icons
import EditEmployeeModal from './components/EditEmployeeModal';
import DeleteEmployeeConfirmationModal from './components/DeleteEmployeeConfirmationModal';
import { useSelector } from 'react-redux';

const EmployeeManagement = () => {
  const { register, handleSubmit, reset, control, formState: { errors, isSubmitting } } = useForm();
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditEmployeeModal, setShowEditEmployeeModal] = useState(false); // State to control edit modal visibility
  const [editingEmployee, setEditingEmployee] = useState(null); // State to store the employee being edited
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false); // State to control delete confirmation modal visibility
  const [employeeToDelete, setEmployeeToDelete] = useState(null); // State to store the employee to be deleted

  // Get actual user from Redux store
  const { user } = useSelector((state) => state.auth);

  const fetchEmployeesAndDepartments = useCallback(async () => {
    setLoading(true);
    // Fetch departments
    const { data: deptData, error: deptError } = await supabase.from('departments').select('id, name');
    if (deptError) {
      setError('Failed to fetch departments.');
      console.error('Error fetching departments:', deptError); // Log department fetch error
    } else {
      setDepartments(deptData.map(d => ({ value: d.id, label: d.name })));
    }

    // Fetch employees
    const { data: empData, error: empError } = await supabase.from('employees').select('*, departments(name)');
    if (empError) {
      setError('Failed to fetch employees.');
      console.error('Error fetching employees:', empError); // Log employee fetch error
    } else {
      console.log("Fetched employee data (full):", JSON.stringify(empData, null, 2)); // Full object log
      setEmployees(empData);
    }
    setLoading(false);
  }, [setLoading, setError, setDepartments, setEmployees]); // Dependencies for useCallback

  useEffect(() => {
    fetchEmployeesAndDepartments();
  }, [success, fetchEmployeesAndDepartments]); // Refetch when a new employee is added

  const onSubmit = async (data) => {
    setSuccess('');
    setError('');
    try {
      const { error } = await supabase.from('employees').insert({
        full_name: data.fullName,
        email: data.email,
        employee_number: data.employeeNumber,
        department_id: parseInt(data.department_id),
      });
      if (error) throw error;
      setSuccess(`Employee ${data.fullName} added successfully.`);
      reset();
    } catch (err) {
      setError(err.message);
      console.error("Employee creation error:", err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto p-6">
      
      {/* Left Column: Add Employee Form */}
      <div className="lg:col-span-1">
        <div className="bg-card p-8 rounded-xl shadow-lg border border-border">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-foreground">
            <UserPlus size={24} /> Add New Employee
          </h2>
          {success && <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">{success}</div>}
          {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 flex items-center gap-2"><AlertCircle size={20} />{error}</div>}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input label="Full Name" type="text" {...register('fullName', { required: 'Full Name is required' })} error={errors.fullName?.message} />
            <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
            <Input label="Employee ID" type="text" {...register('employeeNumber')} error={errors.employeeNumber?.message} />
            <Controller
              name="department_id"
              control={control}
              rules={{ required: 'Department is required' }}
              render={({ field }) => (
                <Select {...field} label="Department" options={departments} error={errors.department_id?.message} />
              )}
            />
            <Button type="submit" loading={isSubmitting} disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Adding...' : 'Add Employee'}
            </Button>
          </form>
        </div>
      </div>

      {/* Right Column: Employee List */}
      <div className="lg:col-span-2">
          <div className="bg-card p-8 rounded-xl shadow-lg border border-border">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-foreground">
            <Users size={24} /> Employee List
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                <tr>
                  <th scope="col" className="px-6 py-3">Name</th>
                  <th scope="col" className="px-6 py-3">Employee ID</th>
                  <th scope="col" className="px-6 py-3">Department</th>
                  <th scope="col" className="px-6 py-3">Email</th>
                  <th scope="col" className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" className="text-center p-4">Loading...</td></tr>
                ) : employees.length === 0 ? (
                  <tr><td colSpan="5" className="text-center p-4">No employees found.</td></tr>
                ) : (
                  employees.map(emp => (
                    <tr key={emp.id} className="border-b border-border">
                      <td className="px-6 py-4 font-medium text-foreground">{emp.full_name}</td>
                      <td className="px-6 py-4">{emp.employee_number || 'N/A'}</td>
                      <td className="px-6 py-4">{emp.departments?.name || 'N/A'}</td>
                      <td className="px-6 py-4">{emp.email || 'N/A'}</td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary mr-2"
                          onClick={() => {
                            setEditingEmployee(emp);
                            setShowEditEmployeeModal(true);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          onClick={() => {
                            setEmployeeToDelete(emp);
                            setShowDeleteConfirmModal(true);
                          }}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showEditEmployeeModal && editingEmployee && (
        <EditEmployeeModal
          employee={editingEmployee}
          departments={departments}
          onClose={() => {
            setShowEditEmployeeModal(false);
            setEditingEmployee(null);
          }}
          onEmployeeUpdated={() => {
            setSuccess('Employee updated successfully!');
            fetchEmployeesAndDepartments(); // Directly re-fetch data
          }}
        />
      )}

      {showDeleteConfirmModal && employeeToDelete && (
        <DeleteEmployeeConfirmationModal
          employee={employeeToDelete}
          onClose={() => {
            setShowDeleteConfirmModal(false);
            setEmployeeToDelete(null);
          }}
          onConfirmDelete={() => {
            setSuccess('Employee deleted successfully!');
            fetchEmployeesAndDepartments(); // Directly re-fetch data
          }}
        />
      )}
    </div>
  );
};

export default EmployeeManagement;
