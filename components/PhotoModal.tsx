import React, { useEffect, useState } from 'react';
import { MediaItem, User } from '../types';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon, PencilSquareIcon } from './icons/Icons';
import { getUser, getMockUsers } from '../services/api';

interface PhotoModalProps {
  photo: MediaItem;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  onEditClick?: () => void;
}

const PhotoModal: React.FC<PhotoModalProps> = ({ photo, onClose, onNext, onPrev, onEditClick }) => {
  const [uploader, setUploader] = useState<User | null>(null);
  const [userMap, setUserMap] = useState<Map<string, User>>(new Map());

  useEffect(() => {
    const fetchUsers = async () => {
      const uploaderUser = await getUser(photo.uploadedBy);
      if (uploaderUser) setUploader(uploaderUser);

      const allUsers = await getMockUsers();
      const map = new Map<string, User>();
      allUsers.forEach(u => map.set(u.id, u));
      setUserMap(map);
    };
    fetchUsers();
  }, [photo.uploadedBy]);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && onNext) onNext();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50" onClick={onClose}>
      <div className="relative w-full h-full flex items-center justify-center p-4">
        
        {/* Photo and Details */}
        <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-4xl max-h-[90vh] flex flex-col md:flex-row" onClick={e => e.stopPropagation()}>
          <div className="flex-shrink-0 md:w-2/3 flex items-center justify-center bg-black rounded-l-lg">
             {photo.type === 'image' ? (
                <img src={photo.url} alt={photo.description} className={`max-w-full max-h-[90vh] object-contain ${photo.filter || ''}`} />
             ) : (
                <video src={photo.url} controls autoPlay className="max-w-full max-h-[90vh] object-contain" />
             )}
          </div>
          <div className="w-full md:w-1/3 p-4 flex flex-col">
            {uploader && (
              <div className="flex items-center space-x-3 pb-3 border-b border-gray-200 dark:border-gray-800">
                <img src={uploader.avatar} alt={uploader.name} className="h-10 w-10 rounded-full" />
                <div>
                  <p className="font-semibold">{uploader.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(photo.createdAt).toLocaleString()}</p>
                </div>
              </div>
            )}
            <div className="text-gray-700 dark:text-gray-300 py-4 flex-grow overflow-y-auto space-y-4">
              <p>{photo.description || "Nenhuma descrição."}</p>
              {photo.taggedUsers && photo.taggedUsers.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-200">Nesta foto:</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {photo.taggedUsers.map(id => userMap.get(id)?.name).filter(Boolean).join(', ')}
                  </p>
                </div>
              )}
            </div>
             {onEditClick && (
                <button 
                  onClick={onEditClick}
                  disabled={photo.type === 'video'}
                  className="w-full flex items-center justify-center space-x-2 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                    <PencilSquareIcon className="h-5 w-5" />
                    <span>Editar</span>
                </button>
             )}
          </div>
        </div>

        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-gray-300">
          <XMarkIcon className="h-8 w-8" />
        </button>

        {/* Navigation */}
        {onPrev && (
          <button onClick={onPrev} className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black bg-opacity-30 rounded-full p-2 hover:bg-opacity-50">
            <ChevronLeftIcon className="h-8 w-8" />
          </button>
        )}
        {onNext && (
          <button onClick={onNext} className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black bg-opacity-30 rounded-full p-2 hover:bg-opacity-50">
            <ChevronRightIcon className="h-8 w-8" />
          </button>
        )}
      </div>
    </div>
  );
};

export default PhotoModal;