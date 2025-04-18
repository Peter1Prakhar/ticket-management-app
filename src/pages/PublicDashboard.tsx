import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, Users, Clock, CheckCircle } from 'lucide-react';

const PublicDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <HelpCircle className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">Helpdesk</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="btn btn-primary"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="btn btn-secondary"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Customer Support Made Simple
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Get started with our intuitive helpdesk solution. Manage customer support tickets efficiently and provide excellent service.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <Link
              to="/register"
              className="btn btn-primary px-8 py-3 text-lg"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="p-6 border border-gray-200 rounded-lg">
              <Users className="h-12 w-12 text-blue-600" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">Team Collaboration</h3>
              <p className="mt-2 text-gray-500">
                Work together seamlessly with your support team to resolve customer issues quickly.
              </p>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg">
              <Clock className="h-12 w-12 text-blue-600" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">Real-time Updates</h3>
              <p className="mt-2 text-gray-500">
                Stay informed with instant notifications and real-time ticket status updates.
              </p>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg">
              <CheckCircle className="h-12 w-12 text-blue-600" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">Easy to Use</h3>
              <p className="mt-2 text-gray-500">
                Intuitive interface designed for both customers and support agents.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicDashboard;