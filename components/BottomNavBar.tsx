
import React from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboardIcon, CalendarDaysIcon, DiscIcon, UserIcon, PlusCircleIcon } from './icons/Icons';
import { Role } from '../types';

interface BottomNavBarProps {
  onAddClick: () => void;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ onAddClick }) => {
  const { user } = useAuth();
  const location = useLocation();

  const commonClasses = "flex flex-col items-center justify-center flex-1 py-2 text-gray-500 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors";
  const activeClasses = "text-brand-500 dark:text-brand-400";

  const NavItem: React.FC<{ to: string; icon: React.FC<any>; memberOnly?: boolean; }> = ({ to, icon: Icon, memberOnly = false }) => {
    if (memberOnly) {
      if (!user) {
        return (
          <Link to="/login" state={{ from: location, message: "Somente para membros" }} className={commonClasses}>
            <Icon className="h-7 w-7" />
          </Link>
        );
      }
      if (user.role === Role.READER) {
        return (
          <div className={`${commonClasses} opacity-50 cursor-not-allowed`}>
            <Icon className="h-7 w-7" />
          </div>
        );
      }
    }
    return (
      <NavLink to={to} className={({ isActive }) => `${commonClasses} ${isActive ? activeClasses : ''}`}>
        <Icon className="h-7 w-7" />
      </NavLink>
    );
  };

  const ProfileNavItem = () => {
    if (user) {
      return (
        <NavLink to={`/profile/${user.id}`} className={({ isActive }) => `${commonClasses} ${isActive ? activeClasses : ''}`}>
          <img src={user.avatar} alt="Perfil" className="h-7 w-7 rounded-full object-cover" />
        </NavLink>
      );
    }
    return (
      <Link to="/login" className={commonClasses}>
        <UserIcon className="h-7 w-7" />
      </Link>
    );
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex items-center justify-around z-50 lg:hidden shadow-[0_-2px_5px_rgba(0,0,0,0.05)] dark:shadow-[0_-2px_5px_rgba(0,0,0,0.2)] pb-[env(safe-area-inset-bottom)]">
      <NavItem to="/" icon={LayoutDashboardIcon} />
      <NavItem to="/events" icon={CalendarDaysIcon} memberOnly={true} />
      
      {user ? (
        <button 
          onClick={onAddClick} 
          className="flex flex-col items-center justify-center flex-1 py-2 text-brand-500 hover:text-brand-600 transition-colors"
          aria-label="Adicionar mídia"
        >
          <PlusCircleIcon className="h-8 w-8" />
        </button>
      ) : (
        <span className="flex-1"></span>
      )}
      
      <NavItem to="/music" icon={DiscIcon} memberOnly={true} />
      <ProfileNavItem />
    </nav>
  );
};

export default BottomNavBar;