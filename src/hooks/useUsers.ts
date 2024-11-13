import { useState, useEffect } from 'react';
import { User } from '../types';
import { getAllUsers, addUser, updateUser, deleteUser, getUsersByRole } from '../lib/db/users';

export function useUsers(roleFilter?: string) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, [roleFilter]);

  async function loadUsers() {
    try {
      setLoading(true);
      const data = roleFilter ? 
        await getUsersByRole(roleFilter) : 
        await getAllUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError('Failed to load users');
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddUser(user: Omit<User, 'id'> & { password: string }) {
    try {
      setLoading(true);
      const id = await addUser(user);
      setUsers(prev => [...prev, { ...user, id }]);
      return true;
    } catch (err) {
      setError('Failed to add user');
      console.error('Error adding user:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateUser(id: string, data: Partial<User>) {
    try {
      setLoading(true);
      await updateUser(id, data);
      setUsers(prev =>
        prev.map(user =>
          user.id === id ? { ...user, ...data } : user
        )
      );
      return true;
    } catch (err) {
      setError('Failed to update user');
      console.error('Error updating user:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteUser(id: string) {
    try {
      setLoading(true);
      await deleteUser(id);
      setUsers(prev => prev.filter(user => user.id !== id));
      return true;
    } catch (err) {
      setError('Failed to delete user');
      console.error('Error deleting user:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }

  return {
    users,
    loading,
    error,
    addUser: handleAddUser,
    updateUser: handleUpdateUser,
    deleteUser: handleDeleteUser,
    refresh: loadUsers
  };
}