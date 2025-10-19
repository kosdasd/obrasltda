import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { User, Album, MediaItem, Role } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { getUser, getContentForUserProfile, deleteMediaItem } from '../services/api';
import PhotoGrid from '../components/PhotoGrid';
import PhotoModal from '../components/PhotoModal';

interface ProfilePageProps {
  setEditingMediaItem: (mediaItem: MediaItem | null) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ setEditingMediaItem }) => {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser } = useAuth();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [taggedInAlbums, setTaggedInAlbums] = useState<Album[]>([]);
  const [taggedInMedia, setTaggedInMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modals state
  const [selectedMediaItem, setSelectedMediaItem] = useState<MediaItem | null>(null);
  const [selectedMediaList, setSelectedMediaList] = useState<MediaItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;
      setLoading(true);
      setError('');
      try {
        const [pUser, contentData] = await Promise.all([
          getUser(userId),
          getContentForUserProfile(userId, currentUser),
        ]);

        if (pUser) {
          setProfileUser(pUser);
          setTaggedInAlbums(contentData.taggedInAlbums.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
          setTaggedInMedia(contentData.taggedInMedia); // Already sorted by API
        } else {
          setError('Usuário não encontrado.');
        }
      } catch (err) {
        setError('Falha ao carregar o perfil.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, currentUser]);

  const handleMediaClick = (mediaItem: MediaItem, mediaList: MediaItem[]) => {
    setSelectedMediaList(mediaList);
    setSelectedMediaItem(mediaItem);
  };
  
  const handleModalClose = () => {
    setSelectedMediaItem(null);
    setSelectedMediaList([]);
  };

  const handleNextMedia = () => {
    const currentIndex = selectedMediaList.findIndex(p => p.id === selectedMediaItem?.id);
    if (currentIndex > -1 && currentIndex < selectedMediaList.length - 1) {
      setSelectedMediaItem(selectedMediaList[currentIndex + 1]);
    }
  };

  const handlePrevMedia = () => {
    const currentIndex = selectedMediaList.findIndex(p => p.id === selectedMediaItem?.id);
    if (currentIndex > 0) {
      setSelectedMediaItem(selectedMediaList[currentIndex - 1]);
    }
  };
  
  const handleEditClick = (mediaItem: MediaItem) => {
    handleModalClose(); // Close the photo view modal first
    setEditingMediaItem(mediaItem);
  };

  const handleDeleteMedia = async (mediaItem: MediaItem) => {
    if (window.confirm('Tem certeza que deseja apagar esta mídia permanentemente?')) {
        try {
            const success = await deleteMediaItem(mediaItem.id, mediaItem.albumId);
            if (success) {
                handleModalClose();
                // Refresh data by removing item from state
                setTaggedInMedia(currentMedia => currentMedia.filter(p => p.id !== mediaItem.id));
            } else {
                alert('Falha ao apagar a mídia.');
            }
        } catch (error) {
            console.error(error);
            alert('Ocorreu um erro.');
        }
    }
  };


  if (loading) return <p className="text-center py-10">Carregando perfil...</p>;
  if (error) return <p className="text-center py-10 text-red-500">{error}</p>;
  if (!profileUser) return <p className="text-center py-10">Usuário não encontrado.</p>;

  return (
    <div className="py-8">
      <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left space-y-4 sm:space-y-0 sm:space-x-8 mb-12">
        <img src={profileUser.avatar} alt={profileUser.name} className="h-32 w-32 rounded-full object-cover ring-4 ring-offset-2 ring-offset-gray-100 dark:ring-offset-black ring-brand-500" />
        <div>
          <h1 className="text-4xl font-bold">{profileUser.name}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{profileUser.email}</p>
          <p className="text-sm bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold px-2 py-0.5 rounded-full inline-block mt-2">{profileUser.role}</p>
        </div>
      </div>
      
      <div className="space-y-12">
        <div>
          <h2 className="text-2xl font-bold mb-6">Álbuns em que aparece</h2>
            {taggedInAlbums.length > 0 ? (
                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {taggedInAlbums.map(album => (
                        <Link to={`/album/${album.id}`} key={album.id} className="group block bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                            <div className="relative aspect-square overflow-hidden">
                                <img src={album.coverPhoto} alt={album.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-lg truncate group-hover:text-brand-500 transition-colors">{album.title}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">{album.description}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400 py-10">
                {profileUser.name} não foi marcado(a) em nenhum álbum.
              </p>
            )}
        </div>

        {taggedInMedia.length > 0 && (
            <div>
                 <h2 className="text-2xl font-bold mb-6">Fotos e Vídeos em que aparece</h2>
                 <PhotoGrid photos={taggedInMedia} onPhotoClick={(photo) => handleMediaClick(photo, taggedInMedia)} />
            </div>
        )}
      </div>

      {selectedMediaItem && (
        <PhotoModal 
          photo={selectedMediaItem}
          currentUser={currentUser}
          onClose={handleModalClose}
          onNext={selectedMediaList.findIndex(p => p.id === selectedMediaItem.id) < selectedMediaList.length - 1 ? handleNextMedia : undefined}
          onPrev={selectedMediaList.findIndex(p => p.id === selectedMediaItem.id) > 0 ? handlePrevMedia : undefined}
          onEditClick={currentUser?.id === selectedMediaItem.uploadedBy || (currentUser?.role && [Role.ADMIN, Role.ADMIN_MASTER].includes(currentUser.role)) ? () => handleEditClick(selectedMediaItem) : undefined}
          onDeleteClick={currentUser?.role === Role.ADMIN_MASTER ? () => handleDeleteMedia(selectedMediaItem) : undefined}
        />
      )}
    </div>
  );
};

export default ProfilePage;