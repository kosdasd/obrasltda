
import React, { useState, useEffect, useMemo } from 'react';
import { Album, User, Story } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { getAlbumsForFeed, getMockUsers, getStories, getUser } from '../services/api';
import { Link } from 'react-router-dom';
import { FunnelIcon, ChevronUpIcon } from '../components/icons/Icons';
import StoryReel from '../components/StoryReel';
import StoryViewer from '../components/StoryViewer';

interface HomePageProps {
  dataVersion: number;
}

const HomePage: React.FC<HomePageProps> = ({ dataVersion }) => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [selectedEventTitles, setSelectedEventTitles] = useState<string[]>([]);

  // Story Viewer State
  const [viewingStoriesForUser, setViewingStoriesForUser] = useState<User | null>(null);

  const { user } = useAuth();

  const userMap = useMemo(() => {
    const map = new Map<string, User>();
    users.forEach(u => map.set(u.id, u));
    return map;
  }, [users]);

  const storiesByUser = useMemo(() => {
    const grouped: { [key: string]: Story[] } = {};
    stories.forEach(story => {
      if (!grouped[story.userId]) {
        grouped[story.userId] = [];
      }
      grouped[story.userId].push(story);
    });
    return grouped;
  }, [stories]);

  useEffect(() => {
    fetchData();
    getMockUsers().then(setUsers);
    getStories().then(setStories);
  }, [user, dataVersion]);

  const fetchData = async (filters?: { taggedUserIds?: string[]; eventTitles?: string[] }) => {
    setLoading(true);
    const feedAlbums = await getAlbumsForFeed(user, filters);
    feedAlbums.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setAlbums(feedAlbums);
    setLoading(false);
  };

  const handleFilterApply = () => {
    fetchData({ taggedUserIds: selectedUserIds, eventTitles: selectedEventTitles });
  };

  const handleFilterClear = () => {
    setSelectedUserIds([]);
    setSelectedEventTitles([]);
    fetchData();
  };

  const toggleUserId = (id: string) => {
    setSelectedUserIds(prev =>
      prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
    );
  };

  const toggleEventTitle = (title: string) => {
    setSelectedEventTitles(prev =>
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  };
  
  const handleUserStoryClick = async (userId: string) => {
    const userToView = await getUser(userId);
    setViewingStoriesForUser(userToView);
  }

  const allEventTitles = useMemo(() => ['Churrasco na Laje', 'Viagem para a Praia', 'Festa a Fantasia Secreta', 'Fotos Públicas', 'Sem Álbum'], []);


  const renderAlbumItem = (album: Album) => {
    const author = userMap.get(album.createdBy);
    const isVirtualAlbum = album.id === 'album-virtual-albumless';
    const albumTitle = isVirtualAlbum ? "Publicações Avulsas" : album.title;

    return (
      <div key={album.id} className="bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden">
        <div className="p-4">
          {author && !isVirtualAlbum ? (
            <div className="flex items-center space-x-3">
              <Link to={`/profile/${author.id}`}>
                <img src={author.avatar} alt={author.name} className="h-10 w-10 rounded-full object-cover" />
              </Link>
              <div>
                <p className="font-semibold">
                  <Link to={`/profile/${album.createdBy}`} className="hover:underline">
                    {author?.name || `Usuário ${album.createdBy}`}
                  </Link>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(album.createdAt).toLocaleString()}</p>
              </div>
            </div>
          ) : (
            <div className="h-10"></div> // Placeholder to keep height consistent
          )}
          <p className="mt-4 text-gray-800 dark:text-gray-200">{album.description}</p>
        </div>
        
        {album.photos.length > 0 && (
          <Link to={`/profile/${album.createdBy}`}>
            <img src={album.coverPhoto} alt={album.title} className="w-full h-auto object-cover max-h-96" />
          </Link>
        )}

        <div className="p-4">
          <h2 className="font-bold text-lg">{albumTitle}</h2>
          {album.taggedUsers.length > 0 && !isVirtualAlbum && (
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Com: {album.taggedUsers.map(uid => userMap.get(uid)?.name).filter(Boolean).join(', ')}
            </div>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <div className="py-8">
       <StoryReel storiesByUser={storiesByUser} users={users} onUserClick={handleUserStoryClick} />
      
      <div className="flex justify-between items-center my-6">
        <h1 className="text-3xl font-bold">Feed de Atividades</h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          <FunnelIcon className="h-5 w-5" />
          <span>Filtros</span>
          <ChevronUpIcon className={`h-5 w-5 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {showFilters && (
        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow mb-6 space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Pessoas marcadas</h3>
            <div className="flex flex-wrap gap-2">
              {users.map(u => (
                <button
                  key={u.id}
                  onClick={() => toggleUserId(u.id)}
                  className={`px-3 py-1 rounded-full text-sm ${selectedUserIds.includes(u.id) ? 'bg-brand-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
                >
                  {u.name}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Eventos</h3>
            <div className="flex flex-wrap gap-2">
              {allEventTitles.map(title => (
                <button
                  key={title}
                  onClick={() => toggleEventTitle(title)}
                  className={`px-3 py-1 rounded-full text-sm ${selectedEventTitles.includes(title) ? 'bg-brand-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
                >
                  {title}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
            <button onClick={handleFilterClear} className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Limpar Filtros</button>
            <button onClick={handleFilterApply} className="bg-brand-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-600 text-sm">Aplicar</button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-center text-gray-500 dark:text-gray-400 py-10">Carregando feed...</p>
      ) : (
        <div className="space-y-8">
          {albums.length > 0 ? albums.map(renderAlbumItem) : <p className="text-center text-gray-500 dark:text-gray-400 py-10">Nenhum álbum encontrado para os filtros selecionados.</p>}
        </div>
      )}

      {viewingStoriesForUser && (
        <StoryViewer 
            user={viewingStoriesForUser}
            stories={storiesByUser[viewingStoriesForUser.id] || []}
            onClose={() => setViewingStoriesForUser(null)}
        />
      )}
    </div>
  );
};

export default HomePage;
