import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import api from '../../services/api';

interface NewTicketFormData {
  title: string;
  initialNote: string;
}

const NewTicket: React.FC = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<NewTicketFormData>();
  const navigate = useNavigate();
  
  const onSubmit = async (data: NewTicketFormData) => {
    try {
      const response = await api.post('/api/tickets', data);
      toast.success('Ticket created successfully');
      navigate(`/tickets/${response.data.ticket._id}`);
    } catch (error) {
      toast.error('Failed to create ticket');
      console.error('Error creating ticket:', error);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <button 
          className="mr-3 text-gray-500 hover:text-gray-700"
          onClick={() => navigate('/tickets')}
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Create New Ticket</h1>
      </div>
      
      <div className="card p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="title" className="label">
              Ticket Title
            </label>
            <input
              id="title"
              type="text"
              className="input"
              placeholder="Brief description of the issue"
              {...register('title', {
                required: 'Title is required',
                minLength: {
                  value: 5,
                  message: 'Title must be at least 5 characters'
                }
              })}
            />
            {errors.title && <p className="error">{errors.title.message}</p>}
          </div>
          
          <div>
            <label htmlFor="initialNote" className="label">
              Description
            </label>
            <textarea
              id="initialNote"
              rows={5}
              className="input"
              placeholder="Please describe your issue in detail"
              {...register('initialNote', {
                required: 'Description is required',
                minLength: {
                  value: 10,
                  message: 'Description must be at least 10 characters'
                }
              })}
            />
            {errors.initialNote && <p className="error">{errors.initialNote.message}</p>}
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              className="btn btn-secondary mr-3"
              onClick={() => navigate('/tickets')}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
            >
              {isSubmitting ? 'Creating...' : 'Create Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTicket;