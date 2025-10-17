import React, { useState, useEffect, useCallback } from 'react';
import { User, Role } from '../types';
import { getMockUsers, updateUser } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { CheckBadgeIcon, UserIcon } from '../components/icons/Icons';

const AdminPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const { user: currentUser } = useAuth();

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        const allUsers = await getMockUsers();
        setUsers(allUsers.sort((a,b) => a.name.localeCompare(b.name)));
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleStatusChange = async (userToUpdate: User, newStatus: 'APPROVED' | 'PENDING') => {
        if (!currentUser || currentUser.role !== Role.ADMIN_MASTER) {
            alert("Você não tem permissão para realizar esta ação.");
            return;
        }
        await updateUser(userToUpdate.id, { status: newStatus });
        fetchUsers(); // Refresh the list
    };

    const handleRoleChange = async (userToUpdate: User, newRole: Role) => {
         if (!currentUser || currentUser.role !== Role.ADMIN_MASTER) {
            alert("Você não tem permissão para realizar esta ação.");
            return;
        }
         if (userToUpdate.id === currentUser.id && newRole !== Role.ADMIN_MASTER) {
            alert("Você não pode rebaixar sua própria conta.");
            return;
        }
        await updateUser(userToUpdate.id, { role: newRole });
        fetchUsers(); // Refresh the list
    };

    if (loading) {
        return <p className="text-center py-10">Carregando usuários...</p>;
    }

    return (
        <div className="py-8">
            <h1 className="text-3xl font-bold mb-8">Painel Administrativo</h1>

            <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Usuário</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Cargo</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                        {users.map(user => (
                            <tr key={user.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <img className="h-10 w-10 rounded-full" src={user.avatar} alt="" />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <select 
                                        value={user.role} 
                                        onChange={(e) => handleRoleChange(user, e.target.value as Role)}
                                        className="text-sm border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 focus:ring-brand-500 focus:border-brand-500"
                                    >
                                        {Object.values(Role).map(role => <option key={role} value={role}>{role}</option>)}
                                    </select>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'APPROVED' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>
                                        {user.status === 'APPROVED' ? 'Aprovado' : 'Pendente'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    {user.status === 'PENDING' && (
                                        <button onClick={() => handleStatusChange(user, 'APPROVED')} className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-200">
                                            Aprovar
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminPage;
