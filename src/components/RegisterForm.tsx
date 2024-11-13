import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Loader2, Pill } from 'lucide-react';

interface RegisterFormProps {
  onSuccess: () => void;
  onLoginClick: () => void;
}

export default function RegisterForm({ onSuccess, onLoginClick }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [validationError, setValidationError] = useState<string | null>(null);
  const { register, loading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (formData.password !== formData.confirmPassword) {
      setValidationError("Passwords don't match");
      return;
    }

    if (formData.password.length < 6) {
      setValidationError("Password must be at least 6 characters long");
      return;
    }

    const user = await register(formData.email, formData.password, formData.name);
    if (user) {
      onSuccess();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Pill className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">PharmaCare</h1>
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">Create Your Account</h2>
        
        {(error || validationError) && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
            {validationError || error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="Enter your full name"
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
              placeholder="Enter your email"
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
              placeholder="Create a password"
            />
            <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters long</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="Confirm your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </button>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onLoginClick}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign In
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}