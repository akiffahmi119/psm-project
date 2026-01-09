import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { DashboardSkeleton } from '../../components/ui/LoadingState';
import { NotificationContainer, NotificationToast } from '../../components/ui/NotificationToast';
import { Edit, Trash2 } from 'lucide-react'; // Added Edit and Trash2 icons
import EditDepartmentModal from './components/EditDepartmentModal';
import DeleteDepartmentConfirmationModal from './components/DeleteDepartmentConfirmationModal';

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [newDepartmentName, setNewDepartmentName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [showEditDepartmentModal, setShowEditDepartmentModal] = useState(false); // State to control edit modal visibility
  const [editingDepartment, setEditingDepartment] = useState(null); // State to store the department being edited
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false); // State to control delete confirmation modal visibility
  const [departmentToDelete, setDepartmentToDelete] = useState(null); // State to store the department to be deleted

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('departments').select('*');
    if (error) {
      addNotification('Error fetching departments', 'error');
    } else {
      setDepartments(data);
    }
    setIsLoading(false);
  };

  const addNotification = (message, type = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  };

  const handleAddDepartment = async (e) => {
    e.preventDefault();
    if (!newDepartmentName.trim()) {
      addNotification('Department name cannot be empty', 'error');
      return;
    }

    const { data, error } = await supabase
      .from('departments')
      .insert([{ name: newDepartmentName.trim() }])
      .select();

    if (error) {
      addNotification(`Error: ${error.message}`, 'error');
    } else {
      addNotification(`Department "${data[0].name}" added successfully.`);
      setDepartments([...departments, data[0]]);
      setNewDepartmentName('');
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <DashboardSkeleton />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">Department Management</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-card p-6 rounded-lg border">
          <h2 className="text-lg font-semibold mb-4">Add New Department</h2>
          <form onSubmit={handleAddDepartment} className="space-y-4">
            <div>
              <label htmlFor="departmentName" className="block text-sm font-medium text-muted-foreground mb-1">
                Department Name
              </label>
              <Input
                id="departmentName"
                value={newDepartmentName}
                onChange={(e) => setNewDepartmentName(e.target.value)}
                placeholder="e.g., Engineering"
              />
            </div>
            <Button type="submit">Add Department</Button>
          </form>
        </div>

        <div className="md:col-span-2 bg-card p-6 rounded-lg border">
          <h2 className="text-lg font-semibold mb-4">Existing Departments</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-background">
                <tr>
                  <th scope="col" className="px-6 py-3">ID</th>
                  <th scope="col" className="px-6 py-3">Name</th>
                  <th scope="col" className="px-6 py-3">Created At</th>
                  <th scope="col" className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((dept) => (
                  <tr key={dept.id} className="border-b">
                    <td className="px-6 py-4">{dept.id}</td>
                    <td className="px-6 py-4 font-medium text-foreground">{dept.name}</td>
                    <td className="px-6 py-4">{new Date(dept.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary mr-2"
                        onClick={() => {
                          setEditingDepartment(dept);
                          setShowEditDepartmentModal(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => {
                          setDepartmentToDelete(dept);
                          setShowDeleteConfirmModal(true);
                        }}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {departments.length === 0 && (
              <p className="text-center text-muted-foreground mt-4">No departments found.</p>
            )}
          </div>
        </div>
      </div>
      <NotificationContainer notifications={notifications} onRemove={(id) => setNotifications(prev => prev.filter(n => n.id !== id))} />

      {showEditDepartmentModal && editingDepartment && (
        <EditDepartmentModal
          department={editingDepartment}
          onClose={() => {
            setShowEditDepartmentModal(false);
            setEditingDepartment(null);
          }}
          onDepartmentUpdated={() => {
            fetchDepartments(); // Refresh the list of departments
            addNotification('Department updated successfully!', 'success');
          }}
        />
      )}

      {showDeleteConfirmModal && departmentToDelete && (
        <DeleteDepartmentConfirmationModal
          department={departmentToDelete}
          onClose={() => {
            setShowDeleteConfirmModal(false);
            setDepartmentToDelete(null);
          }}
          onConfirmDelete={() => {
            fetchDepartments(); // Refresh the list of departments
            addNotification('Department deleted successfully!', 'success');
          }}
        />
      )}
    </div>
  );
};

export default DepartmentManagement;
