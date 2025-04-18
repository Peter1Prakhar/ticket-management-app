import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import api from '../services/api';
import { Ticket, Users, ClipboardCheck, AlertCircle } from 'lucide-react';

interface DashboardStats {
  totalTickets: number;
  activeTickets: number;
  pendingTickets: number;
  closedTickets: number;
  totalCustomers: number;
  totalAgents: number;
  totalAdmins: number;
}

interface RecentTicket {
  _id: string;
  title: string;
  status: string;
  updatedAt: string;
  customer: {
    name: string;
  };
}

const Dashboard: React.FC = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentTickets, setRecentTickets] = useState<RecentTicket[]>([]);
  
  useEffect(() => {
    // Redirect non-admin users to tickets page
    if (!isAdmin()) {
      navigate('/tickets');
      return;
    }
    
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/api/dashboard');
        setStats(response.data.stats);
        setRecentTickets(response.data.recentTickets);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [isAdmin, navigate]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  // If not admin
  if (!isAdmin()) return null;
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Tickets */}
        <div className="card p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Ticket className="h-10 w-10 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Tickets</dt>
                <dd className="text-3xl font-semibold text-gray-900">{stats?.totalTickets}</dd>
              </dl>
            </div>
          </div>
        </div>
        
        {/* Active Tickets */}
        <div className="card p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertCircle className="h-10 w-10 text-green-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Active Tickets</dt>
                <dd className="text-3xl font-semibold text-gray-900">{stats?.activeTickets}</dd>
              </dl>
            </div>
          </div>
        </div>
        
        {/* Total Customers */}
        <div className="card p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-10 w-10 text-indigo-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Customers</dt>
                <dd className="text-3xl font-semibold text-gray-900">{stats?.totalCustomers}</dd>
              </dl>
            </div>
          </div>
        </div>
        
        {/* Closed Tickets */}
        <div className="card p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ClipboardCheck className="h-10 w-10 text-teal-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Closed Tickets</dt>
                <dd className="text-3xl font-semibold text-gray-900">{stats?.closedTickets}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Tickets */}
      <div className="card overflow-hidden">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Recent Tickets</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
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
              {recentTickets.map((ticket) => (
                <tr 
                  key={ticket._id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/tickets/${ticket._id}`)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{ticket.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{ticket.customer.name}</div>
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
              
              {recentTickets.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    No tickets found
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

export default Dashboard;