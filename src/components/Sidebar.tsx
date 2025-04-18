import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Ticket, 
  Users, 
  ChevronLeft, 
  ChevronRight,
  HelpCircle
} from 'lucide-react';
import { cn } from '../utils/cn';

const Sidebar: React.FC = () => {
  const { isAdmin } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  
  return (
    <aside 
      className={cn(
        "bg-gray-900 text-white transition-all duration-300 ease-in-out relative flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className={cn(
        "h-16 flex items-center",
        collapsed ? "justify-center" : "px-4"
      )}>
        <HelpCircle className="h-8 w-8 text-blue-400" />
        {!collapsed && <span className="ml-2 text-xl font-semibold">Helpdesk</span>}
      </div>
      
      {/* Toggle button */}
      <button
        className="absolute -right-3 top-20 bg-gray-700 rounded-full p-1 text-gray-300 hover:text-white"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
      
      {/* Navigation Links */}
      <nav className="flex-1 pt-5 pb-4">
        <ul className="space-y-1">
          {/* Dashboard (Admin Only) */}
          {isAdmin() && (
            <li>
              <NavLink
                to="/"
                className={({ isActive }) => cn(
                  "flex items-center py-2 px-4 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200",
                  isActive ? "bg-gray-800 text-white" : "",
                  collapsed ? "justify-center" : ""
                )}
              >
                <LayoutDashboard className={cn("h-5 w-5", !collapsed && "mr-3")} />
                {!collapsed && <span>Dashboard</span>}
              </NavLink>
            </li>
          )}
          
          {/* Tickets */}
          <li>
            <NavLink
              to="/tickets"
              className={({ isActive }) => cn(
                "flex items-center py-2 px-4 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200",
                isActive ? "bg-gray-800 text-white" : "",
                collapsed ? "justify-center" : ""
              )}
            >
              <Ticket className={cn("h-5 w-5", !collapsed && "mr-3")} />
              {!collapsed && <span>Tickets</span>}
            </NavLink>
          </li>
          
          {/* Customers (Admin & Agent Only) */}
          {isAdmin() && (
            <li>
              <NavLink
                to="/customers"
                className={({ isActive }) => cn(
                  "flex items-center py-2 px-4 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200",
                  isActive ? "bg-gray-800 text-white" : "",
                  collapsed ? "justify-center" : ""
                )}
              >
                <Users className={cn("h-5 w-5", !collapsed && "mr-3")} />
                {!collapsed && <span>Customers</span>}
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
      
      {/* Version */}
      <div className={cn(
        "py-2 text-xs text-gray-500",
        collapsed ? "text-center" : "px-4"
      )}>
        {collapsed ? "v1.0" : "Helpdesk v1.0"}
      </div>
    </aside>
  );
};

export default Sidebar;