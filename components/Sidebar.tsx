import React from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboardIcon, CalendarDaysIcon, CakeIcon, DiscIcon } from './icons/Icons';
import { Role } from '../types';

const Sidebar: React.FC = () => {
    const { user } = useAuth();
    const location = useLocation();

    const navItems = [
        { to: '/', text: 'Feed', icon: LayoutDashboardIcon, memberOnly: false },
        { to: '/events', text: 'Eventos', icon: CalendarDaysIcon, memberOnly: true },
        { to: '/birthdays', text: 'Aniversários', icon: CakeIcon, memberOnly: true },
        { to: '/music', text: 'Música', icon: DiscIcon, memberOnly: true },
    ];

    const NavItem: React.FC<{ to: string; text: string; icon: React.FC<React.SVGProps<SVGSVGElement>>; memberOnly: boolean; }> = ({ to, text, icon: Icon, memberOnly }) => {
        const commonClasses = "flex items-center space-x-4 p-3 rounded-lg transition-colors duration-200";
        
        if (memberOnly) {
            if (!user) {
                // Unauthenticated user, link to login
                return (
                    <Link to="/login" state={{ from: location, message: "Somente para membros" }} className={`${commonClasses} text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800`}>
                        <Icon className="h-7 w-7" />
                        <span className="text-lg">{text}</span>
                    </Link>
                );
            }
            if (user.role === Role.READER) {
                // Authenticated but not a member, show disabled item
                return (
                    <div className={`${commonClasses} text-gray-400 dark:text-gray-500 cursor-not-allowed`}>
                        <Icon className="h-7 w-7" />
                        <span className="text-lg">{text}</span>
                    </div>
                );
            }
        }
        
        // Render a regular NavLink for public items or for authorized users
        return (
            <NavLink
                to={to}
                className={({ isActive }) =>
                    `${commonClasses} hover:bg-gray-100 dark:hover:bg-gray-800 ${
                    isActive ? 'font-bold text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'
                    }`
                }
            >
                <Icon className="h-7 w-7" />
                <span className="text-lg">{text}</span>
            </NavLink>
        );
    };

    return (
        <aside className="fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-4 z-40 hidden lg:flex flex-col">
            <Link to="/" className="text-2xl font-bold text-gray-900 dark:text-white mb-8 px-3">
                OBRAS LTDA
            </Link>
            <nav className="flex-grow">
                <ul className="space-y-2">
                    {navItems.map(item => (
                        <li key={item.to}>
                            <NavItem {...item} />
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="mt-auto">
                {/* Future items like settings or user profile can go here */}
            </div>
        </aside>
    );
};

export default Sidebar;