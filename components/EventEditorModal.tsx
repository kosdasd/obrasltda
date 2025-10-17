import React, { useState, useEffect } from 'react';
import { EventItem, User, Album } from '../types';
import { createEvent, updateEvent, deleteEvent, getAllVisibleAlbums } from '../services/api';
import { XMarkIcon, TrashIcon } from './icons/Icons';

interface EventEditorModalProps {
  event: EventItem | null;
  currentUser: User;
  onClose: () => void;
  onSaveComplete: () => void;
}

const EventEditorModal: React.FC<EventEditorModalProps> = ({ event, currentUser, onClose, onSaveComplete }) => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 16));
  const [albumId, setAlbumId] = useState('');
  const [createAlbumAuto, setCreateAlbumAuto] = useState(true);
  
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const isEditing = !!event;

  useEffect(() => {
    if (event) {
        setTitle(event.title);
        setLocation(event.location);
        setDate(new Date(event.date).toISOString().slice(0, 16));
        setAlbumId(event.albumId);
        setCreateAlbumAuto(false); // When editing, default to the linked album
    }

    const fetchAlbums = async () => {
        const allAlbums = await getAllVisibleAlbums(currentUser);
        setAlbums(allAlbums.filter(a => !a.isEventAlbum));
    };
    fetchAlbums();
  }, [event, currentUser]);

  const handleSave = async () => {
    if (!title || !location || !date || (!createAlbumAuto && !albumId)) {
      setError('Todos os campos obrigatórios devem ser preenchidos.');
      return;
    }
    setError('');
    setIsLoading(true);
    
    try {
      const eventDate = new Date(date).toISOString();
      if (isEditing && event) {
        await updateEvent(event.id, { title, location, date: eventDate, albumId }, currentUser);
      } else {
        await createEvent({ title, location, date: eventDate, albumId: createAlbumAuto ? undefined : albumId, createAlbumAutomatically: createAlbumAuto }, currentUser);
      }
      onSaveComplete();
    } catch (err: any) {
      console.error("Failed to save event:", err);
      setError(err.message || 'Ocorreu um erro ao salvar o evento.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
      if(isEditing && event && window.confirm("Tem certeza que deseja apagar este evento? Isso também irá apagar o álbum associado.")) {
          setIsLoading(true);
          try {
              await deleteEvent(event.id, currentUser);
              onSaveComplete();
          } catch (err) {
              console.error("Failed to delete event:", err);
              setError("Ocorreu um erro ao apagar o evento.");
              setIsLoading(false);
          }
      }
  }

  const commonInputClass = "mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm bg-white dark:bg-gray-800";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-lg flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold">{isEditing ? 'Editar Evento' : 'Criar Novo Evento'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 flex-grow overflow-y-auto space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Título</label>
            <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className={commonInputClass} />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Local</label>
            <input type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)} className={commonInputClass} />
          </div>
          <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Data e Hora</label>
              <input type="datetime-local" id="date" value={date} onChange={(e) => setDate(e.target.value)} className={commonInputClass} />
          </div>
           
           <div className="pt-2">
            <label className="flex items-center space-x-3 cursor-pointer">
                <input type="checkbox" checked={createAlbumAuto} onChange={(e) => setCreateAlbumAuto(e.target.checked)} disabled={isEditing} className="h-4 w-4 rounded text-brand-600 border-gray-300 focus:ring-brand-500 disabled:opacity-50" />
                <span className="text-sm font-medium">Criar álbum automaticamente</span>
            </label>
           </div>
           
           {!createAlbumAuto && (
            <div>
                <label htmlFor="albumId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Álbum Associado</label>
                <select id="albumId" value={albumId} onChange={(e) => setAlbumId(e.target.value)} className={commonInputClass} >
                    <option value="">Selecione um álbum</option>
                    {albums.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
                </select>
            </div>
           )}

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        <div className="flex justify-between items-center p-4 border-t border-gray-200 dark:border-gray-800">
          <div>
              {isEditing && (
                  <button onClick={handleDelete} disabled={isLoading} className="text-red-600 hover:text-red-800 font-semibold p-2 rounded-lg disabled:opacity-50">
                      <TrashIcon className="h-5 w-5" />
                  </button>
              )}
          </div>
          <div className="flex items-center">
              <button onClick={onClose} className="text-gray-700 dark:text-gray-300 font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 mr-4">
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="bg-brand-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-600 disabled:bg-brand-300"
              >
                {isLoading ? 'Salvando...' : 'Salvar'}
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventEditorModal;