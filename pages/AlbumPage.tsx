import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Album, MediaItem, User, Role } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { getAlbumById, getUser, deleteMediaItem, getMockUsers } from '../services/api';
import PhotoGrid from '../components/PhotoGrid';
import PhotoModal from '../components/PhotoModal';
import { FunnelIcon, ChevronUpIcon, ChevronDownIcon } from '../components/icons/Icons';

interface AlbumPageProps {
  setEditingMediaItem: (mediaItem: MediaItem | null) => void;
}

const AlbumPage: React.FC<AlbumPageProps> = ({ setEditingMediaItem }) => {
  const { albumId } = useParams<{ albumId: string }>();
  const { user: currentUser } = useAuth();
  
  const [album, setAlbum] = useState<Album | null>(null);
  const [author, setAuthor] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modals state
  const [selectedMediaItem, setSelectedMediaItem] = useState<MediaItem | null>(null);

  // Filter state
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [taggedUsersInAlbum, setTaggedUsersInAlbum] = useState<User[]>([]);

  const fetchAlbumData = useCallback(async () => {
    if (!albumId) {
        setError('ID do álbum não fornecido.');
        setLoading(false);
        return;
    }
    setLoading(true);
    setError('');
    try {
        const albumData = await getAlbumById(albumId, currentUser);
        if (albumData) {
            setAlbum(albumData);
            const authorData = await getUser(albumData.createdBy);
            if (authorData) setAuthor(authorData);

            // Populate filter options
            const taggedIds = new Set(albumData.photos.flatMap(p => p.taggedUsers || []));
            const allUsers = await getMockUsers();
            setTaggedUsersInAlbum(allUsers.filter(u => taggedIds.has(u.id)));

        } else {
            setError('Álbum não encontrado ou você não tem permissão para vê-lo.');
        }
    } catch (err) {
        setError('Falha ao carregar o álbum.');
        console.error(err);
    } finally {
        setLoading(false);
    }
  }, [albumId, currentUser]);
  
  useEffect(() => {
    fetchAlbumData();
  }, [fetchAlbumData]);

  const filteredPhotos = useMemo(() => {
    if (!album) return [];
    if (selectedUserIds.length === 0) return album.photos;
    return album.photos.filter(photo => 
        photo.taggedUsers && photo.taggedUsers.some(userId => selectedUserIds.includes(userId))
    );
  }, [album, selectedUserIds]);
  
  const toggleFilterUser = (userId: string) => {
    setSelectedUserIds(prev => prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]);
  };

  const handleMediaClick = (mediaItem: MediaItem) => {
    setSelectedMediaItem(mediaItem);
  };
  
  const handleModalClose = () => {
    setSelectedMediaItem(null);
  };

  const handleNextMedia = () => {
    if (!album || !selectedMediaItem) return;
    const currentIndex = filteredPhotos.findIndex(p => p.id === selectedMediaItem.id);
    if (currentIndex > -1 && currentIndex < filteredPhotos.length - 1) {
      setSelectedMediaItem(filteredPhotos[currentIndex + 1]);
    }
  };

  const handlePrevMedia = () => {
    if (!album || !selectedMediaItem) return;
    const currentIndex = filteredPhotos.findIndex(p => p.id === selectedMediaItem.id);
    if (currentIndex > 0) {
      setSelectedMediaItem(filteredPhotos[currentIndex - 1]);
    }
  };
  
  const handleEditClick = (mediaItem: MediaItem) => {
    handleModalClose(); // Close the photo view modal first
    setEditingMediaItem(mediaItem);
  };

  if (loading) return <p className="text-center py-10">Carregando álbum...</p>;
  if (error) return <p className="text-center py-10 text-red-500">{error}</p>;
  if (!album) return <p className="text-center py-10">Álbum não encontrado.</p>;

  const canEdit = currentUser?.id === album.createdBy || (currentUser?.role && [Role.ADMIN, Role.ADMIN_MASTER].includes(currentUser.role));

  return (
    <div className="py-8">
        <div className="mb-8">
            <h1 className="text-4xl font-bold">{album.title}</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-2xl">{album.description}</p>
            {author && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Criado por <Link to={`/profile/${author.id}`} className="font-semibold hover:underline">{author.name}</Link> em {new Date(album.createdAt).toLocaleDateString()}
                </p>
            )}
        </div>
        
        <div className="flex justify-end mb-4">
            <button
                onClick={() => setFiltersVisible(!filtersVisible)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-700"
            >
                <FunnelIcon className="h-5 w-5" />
                <span>Filtros</span>
                {filtersVisible ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
            </button>
        </div>

        {filtersVisible && (
             <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow mb-8">
                <h3 className="font-semibold mb-2">Pessoas marcadas neste álbum</h3>
                {taggedUsersInAlbum.length > 0 ? (
                    <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
                    {taggedUsersInAlbum.map(u => (
                        <label key={u.id} className="flex items-center space-x-3 cursor-pointer">
                        <input type="checkbox" checked={selectedUserIds.includes(u.id)} onChange={() => toggleFilterUser(u.id)} className="h-4 w-4 rounded text-brand-600 border-gray-300 focus:ring-brand-500" />
                        <span className="text-sm">{u.name}</span>
                        </label>
                    ))}
                    </div>
                ) : <p className="text-sm text-gray-500">Ninguém foi marcado nas fotos deste álbum.</p>}
            </div>
        )}
      
        <PhotoGrid photos={filteredPhotos} onPhotoClick={handleMediaClick} />

        {selectedMediaItem && (
            <PhotoModal 
                photo={selectedMediaItem}
                onClose={handleModalClose}
                onNext={filteredPhotos.findIndex(p => p.id === selectedMediaItem.id) < filteredPhotos.length - 1 ? handleNextMedia : undefined}
                onPrev={filteredPhotos.findIndex(p => p.id === selectedMediaItem.id) > 0 ? handlePrevMedia : undefined}
                onEditClick={canEdit ? () => handleEditClick(selectedMediaItem) : undefined}
            />
        )}
    </div>
  );
};

export default AlbumPage;