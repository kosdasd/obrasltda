import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { HomeIcon, CalendarDaysIcon, CakeIcon, MusicalNoteIcon } from './icons/Icons';

const Sidebar: React.FC = () => {
    const { user } = useAuth();

    const navItems = [
        { to: '/', text: 'Feed', icon: HomeIcon },
        { to: '/events', text: 'Eventos', icon: CalendarDaysIcon },
        { to: '/birthdays', text: 'Aniversários', icon: CakeIcon },
        { to: '/music', text: 'Música', icon: MusicalNoteIcon },
    ];

    const NavItem: React.FC<{ to: string; text: string; icon: React.FC<React.SVGProps<SVGSVGElement>> }> = ({ to, text, icon: Icon }) => (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `flex items-center space-x-4 p-3 rounded-lg transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                isActive ? 'font-bold text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'
                }`
            }
        >
            <Icon className="h-7 w-7" />
            <span className="text-lg">{text}</span>
        </NavLink>
    );


    if (!user) {
        return null; // Don't show sidebar if not logged in
    }

    return (
        <aside className="fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-4 z-40 hidden lg:flex flex-col">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 px-3">
                OBRAS LTDA
            </h1>
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
