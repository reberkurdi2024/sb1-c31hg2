import React, { useState, useEffect } from 'react';
import { Plus, Search, Shield, Clock, MoreVertical } from 'lucide-react';
import { User } from '../types';
import AddUserModal from './AddUserModal';
import EditUserModal from './EditUserModal';
import DeleteUserModal from './DeleteUserModal';
import { useUsers } from '../hooks/useUsers';

export default function Users() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const {
    users,
    loading,
    error,
    addUser,
    updateUser,
    deleteUser
  } = useUsers();

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = async (user: Omit<User, 'id' | 'lastLogin'>) => {
    const success = await addUser(user);
    if (success) {
      setIsAddModalOpen(false);
    }
  };

  const handleUpdateUser = async (id: string, updatedData: Partial<User>) => {
    const success = await updateUser(id, updatedData);
    if (success) {
      setIsEditModalOpen(false);
      setSelectedUser(null);
    }
  };

  const handleDeleteUser = async (id: string) => {
    const success = await deleteUser(id);
    if (success) {
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-600';
      case 'pharmacist':
        return 'bg-blue-100 text-blue-600';
      case 'cashier':
        return 'bg-green-100 text-green-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Add User
        </button>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
        <Search className="h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search users..."
          className="flex-1 outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <div key={user.id} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <img
                  src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-800">{user.name}</h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs ${getRoleColor(user.role)}`}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </div>
              </div>
              <div className="relative">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === user.id ? null : user.id)}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <MoreVertical className="h-4 w-4 text-gray-400" />
                </button>
                {activeDropdown === user.id && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setActiveDropdown(null)}
                    />
                    <div className="absolute right-0 mt-1 w-36 bg-white rounded-lg shadow-lg border z-20">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setIsEditModalOpen(true);
                          setActiveDropdown(null);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg"
                      >
                        Edit User
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setIsDeleteModalOpen(true);
                          setActiveDropdown(null);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 last:rounded-b-lg"
                      >
                        Delete User
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield className="h-4 w-4" />
                <span>Permissions: {user.permissions.length}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>Last Login: {user.lastLogin || 'Never'}</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {user.permissions.slice(0, 2).map((permission, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                  >
                    {permission.split('_').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </span>
                ))}
                {user.permissions.length > 2 && (
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                    +{user.permissions.length - 2} more
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddUser}
      />

      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdate={handleUpdateUser}
        user={selectedUser}
      />

      <DeleteUserModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleDeleteUser}
        user={selectedUser}
      />
    </div>
  );
}