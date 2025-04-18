import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<RegisterFormData>();
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  
  const onSubmit = async (data: RegisterFormData) => {
    try {
      // await registerUser(data.name, data.email, data.password);
      toast.success('Registration successful!');
      navigate('/tickets');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed');
    }
  };
  
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="name" className="label">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            className="input"
            {...register('name', {
              required: 'Name is required'
            })}
          />
          {errors.name && <p className="error">{errors.name.message}</p>}
        </div>
        
        <div>
          <label htmlFor="email" className="label">
            Email address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className="input"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: 'Please enter a valid email'
              }
            })}
          />
          {errors.email && <p className="error">{errors.email.message}</p>}
        </div>
        
        <div>
          <label htmlFor="password" className="label">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            className="input"
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters'
              }
            })}
          />
          {errors.password && <p className="error">{errors.password.message}</p>}
        </div>
        
        <div>
          <label htmlFor="confirmPassword" className="label">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            className="input"
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: value => value === watch('password') || 'Passwords do not match'
            })}
          />
          {errors.confirmPassword && <p className="error">{errors.confirmPassword.message}</p>}
        </div>
        
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn btn-primary flex justify-center"
          >
            {isSubmitting ? (
              <span className="inline-block h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
            ) : (
              'Register'
            )}
          </button>
        </div>
      </form>
      
      <div className="mt-6">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;