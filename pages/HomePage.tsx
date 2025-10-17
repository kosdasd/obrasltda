import React, { useState, useEffect, useMemo } from 'react';
import { MediaItem, User, Story, Role, Album } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { getMediaForFeed, getMockUsers, getStories, getUser, getAllVisibleAlbums } from '../services/api';
import { Link } from 'react-router-dom';
import StoryReel from '../components/StoryReel';
import StoryViewer from '../components/StoryViewer';
import PhotoModal from '../components/PhotoModal';
import { FunnelIcon, ChevronUpIcon, ChevronDownIcon } from '../components/icons/Icons';

interface HomePageProps {
  dataVersion: number;
  setEditingMediaItem: (mediaItem: MediaItem | null) => void;
}

const FeedItem: React.FC<{ 
  media: MediaItem; 
  author?: User; 
  onMediaClick: (media: MediaItem, mediaList: MediaItem[]) => void;
  mediaList: MediaItem[];
}> = ({ media, author, onMediaClick, mediaList }) => {
  if (!author) return null;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden">
      <div className="p-4 flex items-center space-x-3">
        <Link to={`/profile/${author.id}`}>
          <img src={author.avatar} alt={author.name} className="h-10 w-10 rounded-full object-cover" />
        </Link>
        <div>
          <p className="font-semibold">
            <Link to={`/profile/${author.id}`} className="hover:underline">
              {author.name}
            </Link>
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(media.createdAt).toLocaleString()}</p>
        </div>
      </div>

      <div className="cursor-pointer bg-black flex items-center justify-center" onClick={() => onMediaClick(media, mediaList)}>
        {media.type === 'image' ? (
          <img src={media.url} alt={media.description} className="w-full h-auto object-contain max-h-[75vh]" />
        ) : (
          <video src={media.url} controls className="w-full h-auto max-h-[75vh]" />
        )}
      </div>

      {(media.description || (media.taggedUsers && media.taggedUsers.length > 0)) && (
        <div className="p-4">
          <p className="text-gray-800 dark:text-gray-200">{media.description}</p>
        </div>
      )}
    </div>
  );
};


const HomePage: React.FC<HomePageProps> = ({ dataVersion, setEditingMediaItem }) => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  
  // Filter state
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [selectedAlbumIds, setSelectedAlbumIds] = useState<string[]>([]);

  // Story Viewer State
  const [viewingStoriesForUser, setViewingStoriesForUser] = useState<User | null>(null);
  
  // Photo Viewer Modal State
  const [selectedMediaItem, setSelectedMediaItem] = useState<MediaItem | null>(null);
  const [selectedMediaList, setSelectedMediaList] = useState<MediaItem[]>([]);

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
    const fetchData = async () => {
        setLoading(true);
        const [feedMedia, allUsers, allStories, allAlbums] = await Promise.all([
            getMediaForFeed(user),
            getMockUsers(),
            getStories(),
            getAllVisibleAlbums(user)
        ]);
        setMediaItems(feedMedia.filter(item => item.type === 'image')); // Filter for photos only
        setUsers(allUsers);
        setStories(allStories);
        setAlbums(allAlbums);
        setLoading(false);
    };
    fetchData();
  }, [user, dataVersion]);

  const toggleFilterUser = (userId: string) => {
    setSelectedUserIds(prev => prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]);
  }
  
  const toggleFilterAlbum = (albumId: string) => {
    setSelectedAlbumIds(prev => prev.includes(albumId) ? prev.filter(id => id !== albumId) : [...prev, albumId]);
  }

  const filteredMediaItems = useMemo(() => {
    if (selectedUserIds.length === 0 && selectedAlbumIds.length === 0) {
      return mediaItems;
    }
    return mediaItems.filter(item => {
      const userMatch = selectedUserIds.length > 0 && selectedUserIds.includes(item.uploadedBy);
      const albumMatch = selectedAlbumIds.length > 0 && item.albumId && selectedAlbumIds.includes(item.albumId);
      return userMatch || albumMatch;
    });
  }, [mediaItems, selectedUserIds, selectedAlbumIds]);
  
  const handleUserStoryClick = async (userId: string) => {
    const userToView = await getUser(userId);
    setViewingStoriesForUser(userToView);
  }

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
  
  return (
    <div className="py-8">
       <StoryReel storiesByUser={storiesByUser} users={users} onUserClick={handleUserStoryClick} />
      
      <div className="flex justify-between items-center my-6">
        <h1 className="text-3xl font-bold">Feed de Atividades</h1>
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
        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">Pessoas</h3>
            <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
              {users.map(u => (
                <label key={u.id} className="flex items-center space-x-3 cursor-pointer">
                  <input type="checkbox" checked={selectedUserIds.includes(u.id)} onChange={() => toggleFilterUser(u.id)} className="h-4 w-4 rounded text-brand-600 border-gray-300 focus:ring-brand-500" />
                  <span className="text-sm">{u.name}</span>
                </label>
              ))}
            </div>
          </div>
           <div>
            <h3 className="font-semibold mb-2">Álbuns</h3>
            <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
              {albums.map(a => (
                <label key={a.id} className="flex items-center space-x-3 cursor-pointer">
                  <input type="checkbox" checked={selectedAlbumIds.includes(a.id)} onChange={() => toggleFilterAlbum(a.id)} className="h-4 w-4 rounded text-brand-600 border-gray-300 focus:ring-brand-500" />
                  <span className="text-sm">{a.title}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-center text-gray-500 dark:text-gray-400 py-10">Carregando feed...</p>
      ) : (
        <div className="space-y-8">
          {filteredMediaItems.length > 0 ? filteredMediaItems.map(item => (
            <FeedItem 
                key={item.id} 
                media={item}
                author={userMap.get(item.uploadedBy)}
                onMediaClick={handleMediaClick}
                mediaList={filteredMediaItems}
            />
          )) : <p className="text-center text-gray-500 dark:text-gray-400 py-10">Nenhuma publicação encontrada para os filtros selecionados.</p>}
        </div>
      )}

      {viewingStoriesForUser && (
        <StoryViewer 
            user={viewingStoriesForUser}
            stories={storiesByUser[viewingStoriesForUser.id] || []}
            onClose={() => setViewingStoriesForUser(null)}
        />
      )}

      {selectedMediaItem && (
        <PhotoModal 
          photo={selectedMediaItem}
          onClose={handleModalClose}
          onNext={selectedMediaList.findIndex(p => p.id === selectedMediaItem.id) < selectedMediaList.length - 1 ? handleNextMedia : undefined}
          onPrev={selectedMediaList.findIndex(p => p.id === selectedMediaItem.id) > 0 ? handlePrevMedia : undefined}
          onEditClick={user?.id === selectedMediaItem.uploadedBy || (user?.role && [Role.ADMIN, Role.ADMIN_MASTER].includes(user.role)) ? () => handleEditClick(selectedMediaItem) : undefined}
        />
      )}
    </div>
  );
};

export default HomePage;