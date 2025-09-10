import React, { useState, useEffect } from 'react';
import { X, Save, User as UserIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { User, UserRole, CreateUserDto } from '../../types/user';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: CreateUserDto | Partial<User>) => void;
  user?: User | null;
  mode: 'create' | 'edit' | 'view';
}

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, onSave, user, mode }) => {
  const [formData, setFormData] = useState<CreateUserDto>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: UserRole.DOCTOR,
    department: '',
    licenseNumber: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && mode !== 'create') {
      setFormData({
        email: user.email,
        password: '',
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        department: user.department || '',
        licenseNumber: user.licenseNumber || '',
      });
    } else {
      setFormData({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        role: UserRole.DOCTOR,
        department: '',
        licenseNumber: '',
      });
    }
  }, [user, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'edit') {
        const { password, ...updateData } = formData;
        await onSave(updateData);
      } else {
        await onSave(formData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving user:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              {mode === 'create' ? 'Create User' : mode === 'edit' ? 'Edit User' : 'View User'}
            </h2>
          </div>
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                disabled={mode === 'view'}
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                disabled={mode === 'view'}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              disabled={mode === 'view'}
              required
            />
          </div>

          {mode === 'create' && (
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                required
              />
            </div>
          )}

          <div>
            <Label htmlFor="role">Role</Label>
            <select
              id="role"
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as UserRole }))}
              disabled={mode === 'view'}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value={UserRole.DOCTOR}>Doctor</option>
              <option value={UserRole.NURSE}>Nurse</option>
              <option value={UserRole.ADMIN}>Admin</option>
              <option value={UserRole.SUPER_ADMIN}>Super Admin</option>
            </select>
          </div>

          <div>
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              value={formData.department}
              onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
              disabled={mode === 'view'}
            />
          </div>

          <div>
            <Label htmlFor="licenseNumber">License Number</Label>
            <Input
              id="licenseNumber"
              value={formData.licenseNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, licenseNumber: e.target.value }))}
              disabled={mode === 'view'}
            />
          </div>

          {mode !== 'view' && (
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1 flex items-center gap-2" disabled={loading}>
                <Save className="w-4 h-4" />
                {loading ? 'Saving...' : mode === 'create' ? 'Create' : 'Update'}
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default UserModal;