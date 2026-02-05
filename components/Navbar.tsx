import React from 'react';
import { useData } from '../context/DataContext';
import { LogOut, User, Menu } from 'lucide-react';
import { Link } from 'react-router-dom'; // Actually using HashRouter but Link works same

export const Navbar: React.FC<{ toggleSidebar: () => void }> = ({ toggleSidebar }) => {
  const { user, logout } = useData();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 fixed w-full z-30 top-0 left-0 h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          <div className="flex items-center gap-4">
             <button onClick={toggleSidebar} className="p-2 rounded-md hover:bg-gray-100 lg:hidden">
                <Menu className="h-6 w-6 text-[#00306B]" />
             </button>
            <div className="flex items-center">
              <span className="text-2xl font-bold text-[#00306B] tracking-tighter">PSU</span>
              <div className="h-6 w-px bg-gray-300 mx-3"></div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-[#00306B] leading-tight">ISSUE REPORTING SYSTEM</span>
                <span className="text-[10px] text-gray-500 uppercase tracking-wide">Prince of Songkla University</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-medium text-gray-800">{user?.fullName}</span>
                <span className="text-xs text-gray-500 capitalize">{user?.role}</span>
            </div>
            <div className="h-10 w-10 rounded-full bg-[#EBF5F8] flex items-center justify-center text-[#00306B]">
                <User size={20} />
            </div>
            <button 
                onClick={logout}
                className="text-gray-500 hover:text-red-600 transition-colors p-2"
                title="Logout"
            >
                <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};