import React, { useState, useEffect, useCallback } from 'react';
import { User, Role, Album, MediaItem } from '../types';
import { 
    getMockUsers, 
    updateUserRole, 
    deleteUser,
    createUser,
    getAllAlbumsAndMedia,
    deleteAlbum,
    deleteMediaItem,
} from '../services/api';
import { UserGroupIcon, PhotoIcon, ClipboardDocumentListIcon, TrashIcon, PencilSquareIcon, XMarkIcon } from '../components/icons/Icons';
import { useAuth } from '../contexts/AuthContext';
import PhotoEditorModal from '../components/PhotoEditorModal';


// Small modal component
const Modal: React.FC<{ children: React.ReactNode, title: string, onClose: () => void }> = ({ children, title, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-lg flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6 flex-grow overflow-y-auto">
            {children}
        </div>
      </div>
    </div>
);

// Helper function for role-specific styling
const getRoleClasses = (role: Role) => {
    switch (role) {
        case Role.ADMIN_MASTER:
            return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
        case Role.ADMIN:
            return 'bg-brand-100 text-brand-800 dark:bg-brand-900 dark:text-brand-200';
        case Role.MEMBER:
            return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
        case Role.READER:
        default:
            return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
}

const UserManagement = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const { user: currentUser } = useAuth();
    
    const fetchUsers = useCallback(async () => {
        setLoading(true);
        const allUsers = await getMockUsers();
        setUsers(allUsers);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleRoleChange = async (userId: string, newRole: Role) => {
        await updateUserRole(userId, newRole);
        setEditingUser(null);
        fetchUsers();
    };
    
    const handleDeleteUser = async (userId: string, userName: string) => {
        if(currentUser?.id === userId) {
            alert("Você não pode deletar a si mesmo.");
            return;
        }
        if(window.confirm(`Tem certeza que deseja deletar ${userName}? Esta ação não pode ser desfeita.`)){
            await deleteUser(userId);
            fetchUsers();
        }
    };
    
    const handleCreateUser = async (data: {name: string, email: string, role: Role}) => {
        await createUser(data);
        setIsCreateModalOpen(false);
        fetchUsers();
    }
    
    if (loading) return <div className="text-center p-8">Carregando usuários...</div>;

    return (
        <div>
            <div className="flex justify-end mb-4">
                <button onClick={() => setIsCreateModalOpen(true)} className="bg-brand-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-600">
                    Criar Usuário
                </button>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow overflow-x-auto">
                <table className="w-full min-w-max">
                    <thead>
                        <tr className="border-b dark:border-gray-700">
                            <th className="p-4 text-left font-semibold text-gray-700 dark:text-gray-300">Usuário</th>
                            <th className="p-4 text-left font-semibold text-gray-700 dark:text-gray-300">Email</th>
                            <th className="p-4 text-left font-semibold text-gray-700 dark:text-gray-300">Papel</th>
                            <th className="p-4 text-left font-semibold text-gray-700 dark:text-gray-300">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="border-b dark:border-gray-800 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                <td className="p-4 flex items-center space-x-3">
                                    <img src={user.avatar} alt={user.name} className="h-10 w-10 rounded-full" />
                                    <span className="font-medium text-gray-900 dark:text-gray-100">{user.name}</span>
                                </td>
                                <td className="p-4 text-gray-700 dark:text-gray-300">{user.email}</td>
                                <td className="p-4">
                                    {editingUser?.id === user.id ? (
                                        <select
                                            value={editingUser.role}
                                            onChange={(e) => setEditingUser({...editingUser, role: e.target.value as Role})}
                                            className="block w-full text-sm border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 focus:ring-brand-500 focus:border-brand-500"
                                        >
                                            {Object.values(Role).map(role => <option key={role} value={role}>{role}</option>)}
                                        </select>
                                    ) : (
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRoleClasses(user.role)}`}>{user.role}</span>
                                    )}
                                </td>
                                <td className="p-4">
                                    {editingUser?.id === user.id ? (
                                        <div className="flex space-x-2">
                                            <button onClick={() => handleRoleChange(user.id, editingUser.role)} className="text-green-500 font-semibold text-sm">Salvar</button>
                                            <button onClick={() => setEditingUser(null)} className="text-gray-500 text-sm">Cancelar</button>
                                        </div>
                                    ) : (
                                        <div className="flex space-x-4">
                                            <button onClick={() => setEditingUser(user)} className="text-brand-500 hover:text-brand-700" title="Editar Papel">
                                                <PencilSquareIcon className="h-5 w-5" />
                                            </button>
                                            <button onClick={() => handleDeleteUser(user.id, user.name)} className="text-red-500 hover:text-red-700" title="Deletar Usuário">
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isCreateModalOpen && (
                <Modal title="Criar Novo Usuário" onClose={() => setIsCreateModalOpen(false)}>
                    <CreateUserForm onSubmit={handleCreateUser} onCancel={() => setIsCreateModalOpen(false)} />
                </Modal>
            )}
        </div>
    );
};

const CreateUserForm: React.FC<{ onSubmit: (data: {name: string, email: string, role: Role}) => void; onCancel: () => void; }> = ({ onSubmit, onCancel }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<Role>(Role.MEMBER);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name && email) {
            onSubmit({ name, email, role });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium">Nome</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 focus:ring-brand-500 focus:border-brand-500" />
            </div>
            <div>
                <label className="block text-sm font-medium">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 focus:ring-brand-500 focus:border-brand-500" />
            </div>
            <div>
                <label className="block text-sm font-medium">Papel</label>
                <select value={role} onChange={e => setRole(e.target.value as Role)} className="mt-1 block w-full border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 focus:ring-brand-500 focus:border-brand-500">
                    {Object.values(Role).map(r => <option key={r} value={r}>{r}</option>)}
                </select>
            </div>
            <div className="flex justify-end space-x-4 pt-4">
                <button type="button" onClick={onCancel} className="text-gray-700 dark:text-gray-300 font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">Cancelar</button>
                <button type="submit" className="bg-brand-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-600">Criar</button>
            </div>
        </form>
    )
}

const MediaModerationCard: React.FC<{ media: MediaItem; onEdit: (media: MediaItem) => void; onDelete: (mediaId: string) => void; }> = ({ media, onEdit, onDelete }) => {
    return (
        <div className="relative aspect-square group bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
            {media.type === 'image' ? (
                <img src={media.url} alt={media.description} className="w-full h-full object-cover" />
            ) : (
                <video src={media.url} className="w-full h-full object-cover" muted playsInline />
            )}
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute top-1 right-1 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button 
                    onClick={() => onEdit(media)} 
                    className="bg-black/50 text-white rounded-full p-1.5 hover:bg-brand-500 disabled:bg-gray-600/50 disabled:cursor-not-allowed transition-colors" 
                    title="Editar Mídia"
                    disabled={media.type === 'video'}
                >
                    <PencilSquareIcon className="h-4 w-4" />
                </button>
                <button 
                    onClick={() => onDelete(media.id)} 
                    className="bg-black/50 text-white rounded-full p-1.5 hover:bg-red-500 transition-colors" 
                    title="Deletar Mídia"
                >
                    <TrashIcon className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}


const ContentManagement = () => {
    const [content, setContent] = useState<{ albums: Album[], albumlessMedia: MediaItem[] }>({ albums: [], albumlessMedia: [] });
    const [userMap, setUserMap] = useState<Map<string, User>>(new Map());
    const [loading, setLoading] = useState(true);
    const [editingMediaItem, setEditingMediaItem] = useState<MediaItem | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        const [allContent, allUsers] = await Promise.all([
            getAllAlbumsAndMedia(),
            getMockUsers()
        ]);
        setContent(allContent);
        
        const map = new Map<string, User>();
        allUsers.forEach(u => map.set(u.id, u));
        setUserMap(map);

        setLoading(false);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleDeleteAlbum = async (albumId: string, albumTitle: string) => {
        if(window.confirm(`Tem certeza que deseja deletar o álbum "${albumTitle}" e todo o seu conteúdo?`)){
            await deleteAlbum(albumId);
            fetchData();
        }
    };
    
    const handleDeleteMedia = async (mediaId: string) => {
         if(window.confirm('Tem certeza que deseja deletar esta mídia?')){
            await deleteMediaItem(mediaId);
            fetchData();
        }
    }
    
    const handleEditClick = (mediaItem: MediaItem) => {
        if (mediaItem.type === 'image') {
            setEditingMediaItem(mediaItem);
        }
    };

    const handleCloseEditor = () => setEditingMediaItem(null);
    
    const handleSaveEditor = () => {
        setEditingMediaItem(null);
        fetchData();
    };
    
    if (loading) return <div className="text-center p-8">Carregando conteúdo...</div>;

    return (
        <div className="space-y-12">
            <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Álbuns ({content.albums.length})</h3>
                {content.albums.length > 0 ? (
                    <div className="space-y-8">
                        {content.albums.map(album => (
                            <div key={album.id} className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 sm:p-6">
                                <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b dark:border-gray-800 pb-4 mb-4">
                                    <div>
                                        <h4 className="font-bold text-lg text-gray-900 dark:text-white">{album.title}</h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            Criado por {userMap.get(album.createdBy)?.name || 'Desconhecido'} • {album.photos.length} mídias
                                        </p>
                                    </div>
                                    <button 
                                        onClick={() => handleDeleteAlbum(album.id, album.title)} 
                                        className="mt-3 sm:mt-0 w-full sm:w-auto flex items-center justify-center space-x-2 bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-red-200 dark:hover:bg-red-900/60 transition"
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                        <span>Deletar Álbum</span>
                                    </button>
                                </div>
                                {album.photos.length > 0 ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                        {album.photos.map(media => (
                                            <MediaModerationCard key={media.id} media={media} onEdit={handleEditClick} onDelete={handleDeleteMedia} />
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 dark:text-gray-400 py-4 text-center">Este álbum está vazio.</p>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 dark:text-gray-400">Nenhum álbum criado na plataforma.</p>
                )}
            </div>

            <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Mídia Sem Álbum ({content.albumlessMedia.length})</h3>
                {content.albumlessMedia.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {content.albumlessMedia.map(media => (
                             <MediaModerationCard key={media.id} media={media} onEdit={handleEditClick} onDelete={handleDeleteMedia} />
                        ))}
                    </div>
                ) : (
                     <p className="text-gray-500 dark:text-gray-400">Nenhuma mídia sem álbum.</p>
                )}
            </div>
            
            {editingMediaItem && (
                <PhotoEditorModal
                    photo={editingMediaItem}
                    onClose={handleCloseEditor}
                    onSave={handleSaveEditor}
                />
            )}
        </div>
    );
};


const Logs = () => {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-8 text-center">
            <h3 className="text-xl font-semibold mb-2">Logs de Atividade</h3>
            <p className="text-gray-600 dark:text-gray-400">Esta funcionalidade está em desenvolvimento.</p>
        </div>
    );
};


type Tab = 'users' | 'content' | 'logs';

const AdminPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('users');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'users': return <UserManagement />;
            case 'content': return <ContentManagement />;
            case 'logs': return <Logs />;
            default: return null;
        }
    };
    
    const TabButton: React.FC<{ tabName: Tab; label: string; icon: React.FC<React.SVGProps<SVGSVGElement>> }> = ({ tabName, label, icon: Icon }) => (
        <button
          onClick={() => setActiveTab(tabName)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${activeTab === tabName ? 'bg-brand-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
        >
          <Icon className="h-5 w-5" />
          <span>{label}</span>
        </button>
    );

    return (
        <div className="py-8">
            <h1 className="text-3xl font-bold mb-6">Painel Administrativo</h1>
            
            <div className="flex space-x-2 mb-6 border-b dark:border-gray-800 pb-2">
                <TabButton tabName="users" label="Gerenciar Usuários" icon={UserGroupIcon} />
                <TabButton tabName="content" label="Gerenciar Conteúdo" icon={PhotoIcon} />
                <TabButton tabName="logs" label="Logs de Atividade" icon={ClipboardDocumentListIcon} />
            </div>

            <div>
                {renderTabContent()}
            </div>
        </div>
    );
};

export default AdminPage;