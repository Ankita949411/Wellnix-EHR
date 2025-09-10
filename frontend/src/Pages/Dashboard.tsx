import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, FileText, Settings, Stethoscope } from 'lucide-react';
import PageNavigation from '../components/navigation/PageNavigation';
import Sidebar from '../components/layout/Sidebar';

const Dashboard: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 mb-8">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                Welcome back!
              </h1>
              <p className="text-gray-600 text-lg">Manage your healthcare system efficiently</p>
            </div>
          </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isAdmin && (
            <div 
              className="group bg-white rounded-xl shadow-lg border border-gray-100 p-6 cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300"
              onClick={() => navigate('/users')}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                  User Management
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Manage system users, roles, and permissions
              </p>
              <div className="mt-4 text-red-600 font-medium text-sm group-hover:text-red-700">
                Click to manage →
              </div>
            </div>
          )}
          
          <div className="group bg-white rounded-xl shadow-lg border border-gray-100 p-6 cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                Patients
              </h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              View and manage patient records
            </p>
            <div className="mt-4 text-green-600 font-medium text-sm group-hover:text-green-700">
              Coming soon →
            </div>
          </div>
          
          <div className="group bg-white rounded-xl shadow-lg border border-gray-100 p-6 cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                Appointments
              </h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Schedule and manage appointments
            </p>
            <div className="mt-4 text-blue-600 font-medium text-sm group-hover:text-blue-700">
              Coming soon →
            </div>
          </div>
          
          <div className="group bg-white rounded-xl shadow-lg border border-gray-100 p-6 cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                Reports
              </h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Generate and view medical reports
            </p>
            <div className="mt-4 text-purple-600 font-medium text-sm group-hover:text-purple-700">
              Coming soon →
            </div>
          </div>
          
          <div className="group bg-white rounded-xl shadow-lg border border-gray-100 p-6 cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-gray-600 transition-colors">
                Settings
              </h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Configure system preferences
            </p>
            <div className="mt-4 text-gray-600 font-medium text-sm group-hover:text-gray-700">
              Coming soon →
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;