import React, { useState } from 'react';
import { X } from 'lucide-react';
import { addUser } from '../lib/db/users';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (user: any) => void;
}

export default function AddUserModal({ isOpen, onClose, onAdd }: AddUserModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'pharmacist',
    status: 'active',
    avatar: '',
    permissions: [] as string[]
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const availablePermissions = [
    { id: 'manage_inventory', label: 'Manage Inventory' },
    { id: 'manage_users', label: 'Manage Users' },
    { id: 'manage_sales', label: 'Manage Sales' },
    { id: 'view_reports', label: 'View Reports' },
    { id: 'process_sales', label: 'Process Sales' },
    { id: 'view_inventory', label: 'View Inventory' }
  ];

  const rolePermissions = {
    admin: availablePermissions.map(p => p.id),
    pharmacist: ['manage_inventory', 'view_sales', 'view_reports'],
    cashier: ['process_sales', 'view_inventory']
  };

  const handleRoleChange = (role: string) => {
    setFormData({
      ...formData,
      role: role as 'admin' | 'pharmacist' | 'cashier',
      permissions: rolePermissions[role as keyof typeof rolePermissions]
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userId = await addUser({
        ...formData,
        avatar: formData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random`
      });

      onAdd({
        id: userId,
        ...formData
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-800">Add New User</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.role}
              onChange={(e) => handleRoleChange(e.target.value)}
            >
              <option value="admin">Admin</option>
              <option value="pharmacist">Pharmacist</option>
              <option value="cashier">Cashier</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Avatar URL (optional)
            </label>
            <input
              type="url"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.avatar}
              onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
              placeholder="https://example.com/avatar.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value="active"
                  checked={formData.status === 'active'}
                  onChange={(e) => setFormData({ ...formData, status: 'active' })}
                  className="mr-2"
                />
                Active
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value="inactive"
                  checked={formData.status === 'inactive'}
                  onChange={(e) => setFormData({ ...formData, status: 'inactive' })}
                  className="mr-2"
                />
                Inactive
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Permissions
            </label>
            <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
              {availablePermissions.map((permission) => (
                <label key={permission.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.permissions.includes(permission.id)}
                    onChange={(e) => {
                      const newPermissions = e.target.checked
                        ? [...formData.permissions, permission.id]
                        : formData.permissions.filter(p => p !== permission.id);
                      setFormData({ ...formData, permissions: newPermissions });
                    }}
                    className="mr-2"
                    disabled={formData.role === 'admin'}
                  />
                  {permission.label}
                </label>
              ))}
            </div>
            {formData.role === 'admin' && (
              <p className="text-sm text-gray-500 mt-2">
                Admin users automatically have all permissions
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}