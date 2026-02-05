import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, List, UserCircle } from 'lucide-react';
import { useData } from '../context/DataContext';
import { UserRole } from '../types';

interface SidebarProps {
  isOpen: boolean;
  closeMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, closeMobile }) => {
  const { user } = useData();

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
      isActive
        ? 'bg-[#00306B] text-white shadow-md'
        : 'text-gray-600 hover:bg-[#EBF5F8] hover:text-[#00306B]'
    }`;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={closeMobile}
        />
      )}
      
      <aside className={`
        fixed top-16 left-0 z-40 w-64 h-[calc(100vh-64px)] transition-transform bg-white border-r border-gray-200
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full px-3 py-4 overflow-y-auto bg-white">
            <div className="mb-6 px-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Menu</p>
            </div>
          <ul className="space-y-2 font-medium">
            {user?.role === UserRole.ADMIN && (
                <li>
                <NavLink to="/dashboard" className={navItemClass} onClick={closeMobile}>
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </NavLink>
                </li>
            )}
            
            {/* Report Issue hidden for Admins */}
            {user?.role !== UserRole.ADMIN && (
              <li>
                <NavLink to="/report" className={navItemClass} onClick={closeMobile}>
                  <PlusCircle size={20} />
                  <span>Report Issue</span>
                </NavLink>
              </li>
            )}
            
            <li>
              <NavLink to="/issues" className={navItemClass} onClick={closeMobile}>
                <List size={20} />
                <span>All Issues</span>
              </NavLink>
            </li>

             <li>
              <NavLink to="/profile" className={navItemClass} onClick={closeMobile}>
                <UserCircle size={20} />
                <span>Profile</span>
              </NavLink>
            </li>
          </ul>

          <div className="absolute bottom-4 left-0 w-full px-6">
             <div className="bg-[#EBF5F8] rounded-xl p-4 text-center">
                <p className="text-xs text-[#00306B] font-semibold">Need Help?</p>
                <p className="text-[10px] text-gray-500 mt-1">Contact IT Support Center</p>
                <p className="text-xs font-bold text-[#00306B] mt-1">02-123-4567</p>
             </div>
          </div>
        </div>
      </aside>
    </>
  );
};