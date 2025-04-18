import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import { PlusCircle, Search, X } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface Customer {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

const CustomersList: React.FC = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    // Redirect non-admin users to tickets page
    if (!isAdmin()) {
      navigate('/tickets');
      return;
    }
    
    const fetchCustomers = async () => {
      try {
        const response = await api.get('/api/users');
        setCustomers(response.data.users);
      } catch (error) {
        toast.error('Failed to load customers');
        console.error('Error fetching customers:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCustomers();
  }, [isAdmin, navigate]);
  
  // Filter customers by search query
  const filteredCustomers = customers.filter(customer => {
    return customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           customer.email.toLowerCase().includes(searchQuery.toLowerCase());
  });
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  // If not admin
  if (!isAdmin()) return null;
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        
        <button
          onClick={() => navigate('/customers/new')}
          className="btn btn-primary inline-flex items-center"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          New User
        </button>
      </div>
      
      {/* Search */}
      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search users..."
              className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setSearchQuery('')}
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Customers List */}
      <div className="card shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr 
                  key={customer._id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/customers/${customer._id}`)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                    <div className="text-xs text-gray-500">ID: {customer._id.substring(0, 8)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{customer.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {customer.role.charAt(0).toUpperCase() + customer.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(customer.createdAt), 'MMM d, yyyy')}
                  </td>
                </tr>
              ))}
              
              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">
                    {customers.length > 0 ? (
                      <div>
                        <p className="mb-2">No users match your search criteria</p>
                        <button 
                          onClick={() => setSearchQuery('')}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Clear filters
                        </button>
                      </div>
                    ) : (
                      <p>No users found</p>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomersList;