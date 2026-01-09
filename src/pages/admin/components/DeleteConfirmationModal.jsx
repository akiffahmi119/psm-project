import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import { supabase } from '../../../lib/supabaseClient'; // Import supabase
import { AlertCircle } from 'lucide-react';

const DeleteConfirmationModal = ({ user, onClose, onConfirmDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    setIsDeleting(true);
    setError('');
    try {
      // 1. Delete from profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);

      if (profileError) {
        throw profileError;
      }

      // 2. Delete from auth.users
      // This requires service role key or admin context.
      // If the RLS policies are set up correctly, this might not be directly callable from client.
      // However, if the profiles table has a foreign key constraint with ON DELETE CASCADE to auth.users,
      // deleting from auth.users would automatically delete from profiles.
      // For now, I'm assuming the profiles table is the primary target for deletion.
      // If `auth.users` needs to be deleted, a server-side function or admin client would be needed.

      onConfirmDelete(); // Notify parent component that user was deleted
      onClose(); // Close modal
    } catch (err) {
      setError(err.message);
      console.error("Delete error:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-xl border border-border shadow-2xl w-full max-w-md flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Confirm Deletion</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Are you sure you want to delete user: <span className="font-medium">{user?.full_name} ({user?.email})</span>?
            </p>
          </div>
          <Button variant="ghost" size="sm" iconName="X" onClick={onClose} />
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-destructive flex items-center gap-2">
            <AlertCircle size={20} />
            This action cannot be undone. All data associated with this user will be permanently removed from the profiles table.
          </p>
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg flex items-center gap-2">
              <AlertCircle size={20} />
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-border gap-3">
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="destructive" loading={isDeleting} disabled={isDeleting} onClick={handleDelete}>
            {isDeleting ? 'Deleting...' : 'Delete User'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
