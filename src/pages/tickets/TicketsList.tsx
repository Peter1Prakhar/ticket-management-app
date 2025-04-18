import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import { PlusCircle, Search, X } from 'lucide-react';
import api from '../../services/api';

interface Ticket {
  _id: string;
  title: string;
  status: string;
  customer: {
    _id: string;
    name: string;
  };
  updatedAt: string;
}

const dummyTickets: Ticket[] = [
  {
    _id: 'abc123456789',
    title: 'Login issue on dashboard',
    status: 'Active',
    customer: { _id: 'cust1', name: 'Alice Johnson' },
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'def987654321',
    title: 'Payment not processed',
    status: 'Pending',
    customer: { _id: 'cust2', name: 'Bob Smith' },
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'ghi456789012',
    title: 'Unable to reset password',
    status: 'Closed',
    customer: { _id: 'cust3', name: 'Charlie Brown' },
    updatedAt: new Date().toISOString(),
  },
];

const TicketsList: React.FC = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await api.get('/api/tickets');
        setTickets(response.data.tickets);
      } catch (error) {
        console.warn('API fetch failed, using dummy data.');
        setTickets(dummyTickets); // fallback to dummy data
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const handleAddTicket = () => {
    navigate("/tickets/new")
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.customer.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === '' || ticket.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Tickets</h1>

        <button
          onClick={handleAddTicket}
          className="btn btn-primary inline-flex items-center"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          New Ticket
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search tickets..."
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

          <div className="w-full md:w-64">
            <select
              className="block w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <button
            onClick={clearFilters}
            className="btn btn-secondary flex items-center justify-center"
          >
            <X className="h-4 w-4 mr-2" />
            Clear Filters
          </button>
        </div>
      </div>

      {/* Tickets List */}
      <div className="card shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ticket
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTickets.map((ticket) => (
                <tr
                  key={ticket._id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/tickets/${ticket._id}`)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{ticket.title}</div>
                    <div className="text-xs text-gray-500">ID: {ticket._id.substring(0, 8)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{ticket.customer.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`badge ${
                        ticket.status === 'Active'
                          ? 'badge-active'
                          : ticket.status === 'Pending'
                          ? 'badge-pending'
                          : 'badge-closed'
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(ticket.updatedAt), 'MMM d, yyyy')}
                  </td>
                </tr>
              ))}

              {filteredTickets.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">
                    {tickets.length > 0 ? (
                      <div>
                        <p className="mb-2">No tickets match your search criteria</p>
                        <button
                          onClick={clearFilters}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Clear filters
                        </button>
                      </div>
                    ) : (
                      <div>
                        <p className="mb-2">No tickets found</p>
                        <button
                          onClick={handleAddTicket}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Create your first ticket
                        </button>
                      </div>
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

export default TicketsList;
