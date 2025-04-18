import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import { ArrowLeft, User, Mail, Calendar, UserCog, Ticket } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface Customer {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface CustomerTicket {
  _id: string;
  title: string;
  status: string;
  updatedAt: string;
}

const CustomerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [tickets, setTickets] = useState<CustomerTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleUpdating, setRoleUpdating] = useState(false);
  
  useEffect(() => {
    // Redirect non-admin users to tickets page
    if (!isAdmin()) {
      navigate('/tickets');
      return;
    }
    
    const fetchCustomerData = async () => {
      try {
        // Fetch customer details
        const userResponse = await api.get(`/api/users/${id}`);
        setCustomer(userResponse.data.user);
        
        // Fetch customer tickets
        const ticketsResponse = await api.get('/api/tickets');
        const customerTickets = ticketsResponse.data.tickets.filter(
          (ticket: any) => ticket.customer._id === id
        );
        setTickets(customerTickets);
      } catch (error) {
        toast.error('Failed to load customer details');
        console.error('Error fetching customer:', error);
        navigate('/customers');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCustomerData();
  }, [id, isAdmin, navigate]);
  
  const updateUserRole = async (newRole: string) => {
    try {
      setRoleUpdating(true);
      const response = await api.patch(`/api/users/${id}/role`, { role: newRole });
      setCustomer(response.data.user);
      toast.success(`User role updated to ${newRole}`);
    } catch (error) {
      toast.error('Failed to update user role');
      console.error('Error updating user role:', error);
    } finally {
      setRoleUpdating(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  // If not admin
  if (!isAdmin()) return null;
  
  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-gray-500 mb-4">Customer not found</p>
        <button
          onClick={() => navigate('/customers')}
          className="btn btn-primary"
        >
          Back to Customers
        </button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <button 
          className="mr-3 text-gray-500 hover:text-gray-700"
          onClick={() => navigate('/customers')}
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Customer Profile</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Info Card */}
        <div className="card p-6 lg:col-span-1">
          <div className="text-center mb-6">
            <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mx-auto">
              <User className="h-10 w-10" />
            </div>
            <h2 className="mt-4 text-xl font-semibold text-gray-900">{customer.name}</h2>
            <p className="text-sm text-gray-500">{customer.email}</p>
          </div>
          
          <div className="space-y-4 mt-6">
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-gray-400 mr-3" />
              <span className="text-sm text-gray-700">{customer.email}</span>
            </div>
            <div className="flex items-center">
              <UserCog className="h-5 w-5 text-gray-400 mr-3" />
              <span className="text-sm text-gray-700">
                Role: {customer.role.charAt(0).toUpperCase() + customer.role.slice(1)}
              </span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-400 mr-3" />
              <span className="text-sm text-gray-700">
                Joined: {format(new Date(customer.createdAt), 'MMMM d, yyyy')}
              </span>
            </div>
          </div>
          
          {/* Role Management */}
          <div className="mt-8 border-t pt-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Change User Role</h3>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => updateUserRole('customer')}
                disabled={customer.role === 'customer' || roleUpdating}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  customer.role === 'customer'
                    ? 'bg-blue-100 text-blue-800 border-blue-200'
                    : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Customer
              </button>
              <button
                onClick={() => updateUserRole('agent')}
                disabled={customer.role === 'agent' || roleUpdating}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  customer.role === 'agent'
                    ? 'bg-blue-100 text-blue-800 border-blue-200'
                    : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Agent
              </button>
              <button
                onClick={() => updateUserRole('admin')}
                disabled={customer.role === 'admin' || roleUpdating}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  customer.role === 'admin'
                    ? 'bg-blue-100 text-blue-800 border-blue-200'
                    : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Admin
              </button>
            </div>
          </div>
        </div>
        
        {/* Customer Tickets */}
        <div className="card lg:col-span-2">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Customer Tickets</h3>
            <Link
              to="/tickets/new"
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              Create New Ticket
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-white">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tickets.map((ticket) => (
                  <tr 
                    key={ticket._id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/tickets/${ticket._id}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Ticket className="h-4 w-4 text-gray-400 mr-2" />
                        <div className="text-sm font-medium text-gray-900">{ticket.title}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`badge ${
                        ticket.status === 'Active' ? 'badge-active' :
                        ticket.status === 'Pending' ? 'badge-pending' :
                        'badge-closed'
                      }`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(ticket.updatedAt), 'MMM d, yyyy')}
                    </td>
                  </tr>
                ))}
                
                {tickets.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-sm text-gray-500">
                      <p className="mb-2">No tickets found for this customer</p>
                      <Link 
                        to="/tickets/new"
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Create a new ticket
                      </Link>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetail;