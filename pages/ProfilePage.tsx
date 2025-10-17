import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { User, Album, MediaItem } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { getUser, getAlbumsForUser } from '../services/api';
import PhotoGrid from '../components/PhotoGrid';
import PhotoModal from '../components/PhotoModal';

interface ProfilePageProps {
  dataVersion: number;
  setEditingMediaItem: (mediaItem: MediaItem | null) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ dataVersion, setEditingMediaItem }) => {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser } = useAuth();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [albumlessMedia, setAlbumlessMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals state
  const [selectedMediaItem, setSelectedMediaItem] = useState<MediaItem | null>(null);
  const [selectedMediaList, setSelectedMediaList] = useState<MediaItem[]>([]);

  const isOwnProfile = currentUser?.id === userId;

  useEffect(() => {
    const fetchData = async () => {
      if (!userId || !currentUser) return;
      setLoading(true);
      setError('');
      try {
        const [pUser, userData] = await Promise.all([
          getUser(userId),
          getAlbumsForUser(userId, currentUser),
        ]);

        if (pUser) {
          setProfileUser(pUser);
          setAlbums(userData.albums.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
          setAlbumlessMedia(userData.albumlessMedia.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
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
  }, [userId, currentUser, dataVersion]);

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
          <h2 className="text-2xl font-bold mb-6">Álbuns</h2>
          <div className="space-y-10">
            {albums.length > 0 ? albums.map(album => (
              <div key={album.id}>
                <h3 className="text-xl font-semibold mb-3">{album.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{album.description}</p>
                <PhotoGrid photos={album.photos} onPhotoClick={(photo) => handleMediaClick(photo, album.photos)} />
              </div>
            )) : (
              <p className="text-center text-gray-500 dark:text-gray-400 py-10">
                {isOwnProfile ? 'Você ainda não criou nenhum álbum.' : `${profileUser.name} ainda não criou nenhum álbum.`}
              </p>
            )}
          </div>
        </div>

        {albumlessMedia.length > 0 && (
            <div>
                 <h2 className="text-2xl font-bold mb-6">Publicações</h2>
                 <PhotoGrid photos={albumlessMedia} onPhotoClick={(photo) => handleMediaClick(photo, albumlessMedia)} />
            </div>
        )}
      </div>

      {selectedMediaItem && (
        <PhotoModal 
          photo={selectedMediaItem}
          onClose={handleModalClose}
          onNext={selectedMediaList.findIndex(p => p.id === selectedMediaItem.id) < selectedMediaList.length - 1 ? handleNextMedia : undefined}
          onPrev={selectedMediaList.findIndex(p => p.id === selectedMediaItem.id) > 0 ? handlePrevMedia : undefined}
          onEditClick={currentUser?.id === selectedMediaItem.uploadedBy && selectedMediaItem.type === 'image' ? () => handleEditClick(selectedMediaItem) : undefined}
        />
      )}
    </div>
  );
};

export default ProfilePage;