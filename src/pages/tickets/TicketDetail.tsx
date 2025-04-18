import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Send, CheckCircle, Clock, XCircle } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface TicketNote {
  _id: string;
  text: string;
  createdBy: {
    _id: string;
    name: string;
    role: string;
  };
  createdAt: string;
  attachments: {
    filename: string;
    path: string;
    mimetype: string;
  }[];
}

interface TicketData {
  _id: string;
  title: string;
  status: string;
  customer: {
    _id: string;
    name: string;
    email: string;
  };
  notes: TicketNote[];
  createdAt: string;
  updatedAt: string;
}

interface NoteFormData {
  text: string;
}

const TicketDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAgent } = useAuth();
  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<NoteFormData>();
  
  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await api.get(`/api/tickets/${id}`);
        setTicket(response.data.ticket);
      } catch (error) {
        toast.error('Failed to load ticket details');
        console.error('Error fetching ticket:', error);
        navigate('/tickets');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTicket();
  }, [id, navigate]);
  
  const updateStatus = async (status: string) => {
    try {
      const response = await api.patch(`/api/tickets/${id}/status`, { status });
      setTicket(response.data.ticket);
      toast.success(`Ticket status updated to ${status}`);
    } catch (error) {
      toast.error('Failed to update ticket status');
      console.error('Error updating ticket status:', error);
    }
  };
  
  const onSubmit = async (data: NoteFormData) => {
    try {
      const formData = new FormData();
      formData.append('text', data.text);
      
      const response = await api.post(`/api/tickets/${id}/notes`, formData);
      setTicket(response.data.ticket);
      reset();
      toast.success('Note added successfully');
    } catch (error) {
      toast.error('Failed to add note');
      console.error('Error adding note:', error);
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!ticket) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-gray-500 mb-4">Ticket not found</p>
        <button
          onClick={() => navigate('/tickets')}
          className="btn btn-primary"
        >
          Back to Tickets
        </button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <button 
          className="mr-3 text-gray-500 hover:text-gray-700"
          onClick={() => navigate('/tickets')}
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 flex-1">Ticket: {ticket.title}</h1>
      </div>
      
      {/* Ticket Info Card */}
      <div className="card">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className={`badge ${
              ticket.status === 'Active' ? 'badge-active' :
              ticket.status === 'Pending' ? 'badge-pending' :
              'badge-closed'
            }`}>
              {ticket.status}
            </span>
            <p className="text-sm text-gray-500 mt-1">
              Created on {format(new Date(ticket.createdAt), 'MMMM d, yyyy')}
            </p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-900">Customer</p>
            <p className="text-sm text-gray-500">{ticket.customer.name}</p>
          </div>
          
          {isAgent() && (
            <div className="flex space-x-2">
              <button
                onClick={() => updateStatus('Active')}
                disabled={ticket.status === 'Active'}
                className={`inline-flex items-center px-3 py-1.5 border text-sm font-medium rounded-md ${
                  ticket.status === 'Active'
                    ? 'bg-green-100 text-green-800 border-green-200 cursor-default'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500'
                }`}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Active
              </button>
              <button
                onClick={() => updateStatus('Pending')}
                disabled={ticket.status === 'Pending'}
                className={`inline-flex items-center px-3 py-1.5 border text-sm font-medium rounded-md ${
                  ticket.status === 'Pending'
                    ? 'bg-yellow-100 text-yellow-800 border-yellow-200 cursor-default'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500'
                }`}
              >
                <Clock className="h-4 w-4 mr-1" />
                Pending
              </button>
              <button
                onClick={() => updateStatus('Closed')}
                disabled={ticket.status === 'Closed'}
                className={`inline-flex items-center px-3 py-1.5 border text-sm font-medium rounded-md ${
                  ticket.status === 'Closed'
                    ? 'bg-gray-100 text-gray-800 border-gray-200 cursor-default'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500'
                }`}
              >
                <XCircle className="h-4 w-4 mr-1" />
                Closed
              </button>
            </div>
          )}
        </div>
        
        {/* Ticket Notes */}
        <div className="p-6 space-y-6">
          {ticket.notes.map((note, index) => (
            <div key={note._id} className="flex">
              <div className="flex-shrink-0 mr-4">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  {note.createdBy.name.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center">
                  <h3 className="text-sm font-medium text-gray-900">{note.createdBy.name}</h3>
                  <span className="ml-2 px-2 py-0.5 text-xs bg-gray-100 text-gray-800 rounded-full">
                    {note.createdBy.role.charAt(0).toUpperCase() + note.createdBy.role.slice(1)}
                  </span>
                  <span className="ml-2 text-xs text-gray-500">
                    {format(new Date(note.createdAt), 'MMM d, yyyy h:mm a')}
                  </span>
                </div>
                <div className="mt-1 text-sm text-gray-700 whitespace-pre-wrap">
                  {note.text}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Add Note Form */}
        {ticket.status !== 'Closed' && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <form onSubmit={handleSubmit(onSubmit)}>
              <label htmlFor="text" className="sr-only">
                Add a note
              </label>
              <div className="flex">
                <textarea
                  id="text"
                  rows={3}
                  className="input"
                  placeholder="Add a reply..."
                  {...register('text', {
                    required: 'Note text is required',
                    minLength: {
                      value: 3,
                      message: 'Note must be at least 3 characters'
                    }
                  })}
                />
              </div>
              {errors.text && <p className="error mt-1">{errors.text.message}</p>}
              <div className="mt-3 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary inline-flex items-center"
                >
                  {isSubmitting ? (
                    <span className="inline-block h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin mr-2" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  Send Reply
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketDetail;