import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getEvents } from '../services/api';
import { EventItem, Role } from '../types';
import { useAuth } from '../contexts/AuthContext';
import EventEditorModal from '../components/EventEditorModal';
import { PlusIcon } from '../components/icons/Icons';

const EventsPage: React.FC = () => {
    const [events, setEvents] = useState<EventItem[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);

    const fetchEvents = async () => {
        setLoading(true);
        const eventData = await getEvents();
        setEvents(eventData);
        setLoading(false);
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const eventsByYear = useMemo(() => {
        return events.reduce((acc, event) => {
            const year = event.year;
            if (!acc[year]) {
                acc[year] = [];
            }
            acc[year].push(event);
            return acc;
        }, {} as Record<number, EventItem[]>);
    }, [events]);
    
    const handleCreateClick = () => {
        setEditingEvent(null);
        setIsEditorOpen(true);
    };

    const handleEditClick = (event: EventItem) => {
        setEditingEvent(event);
        setIsEditorOpen(true);
    }
    
    const handleEditorClose = () => {
        setIsEditorOpen(false);
        setEditingEvent(null);
    }
    
    const handleSaveComplete = () => {
        handleEditorClose();
        fetchEvents(); // Refresh data
    }

    const isAdmin = user?.role === Role.ADMIN || user?.role === Role.ADMIN_MASTER;

    if (loading) {
        return <p className="text-center py-10">Carregando eventos...</p>;
    }

    return (
        <div className="py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Eventos</h1>
                {isAdmin && (
                    <button 
                        onClick={handleCreateClick}
                        className="flex items-center space-x-2 bg-brand-500 hover:bg-brand-600 text-white font-bold py-2 px-4 rounded-lg"
                    >
                        <PlusIcon className="h-5 w-5" />
                        <span>Novo Evento</span>
                    </button>
                )}
            </div>
            
            <div className="space-y-10">
                {Object.keys(eventsByYear).sort((a,b) => Number(b) - Number(a)).map(year => (
                    <div key={year}>
                        <h2 className="text-2xl font-bold mb-4">{year}</h2>
                        <div className="space-y-4">
                            {eventsByYear[Number(year)].map(event => (
                                <div key={event.id} className="group flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-lg shadow hover:shadow-md transition">
                                    <Link to={`/album/${event.albumId}`} className="flex-grow">
                                        <div className="flex items-center space-x-4">
                                            <div className="text-center w-16 flex-shrink-0">
                                                <p className="font-bold text-lg text-brand-600 dark:text-brand-400">{event.date.split('/')[0]}</p>
                                                <p className="text-sm uppercase text-gray-500">{event.date.split('/')[1]}</p>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900 dark:text-white group-hover:text-brand-500 transition">{event.title}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{event.location}</p>
                                            </div>
                                        </div>
                                    </Link>
                                    {isAdmin && (
                                        <button onClick={() => handleEditClick(event)} className="text-sm text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 ml-4 opacity-0 group-hover:opacity-100 transition">
                                            Editar
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            {isEditorOpen && user && (
                <EventEditorModal 
                    event={editingEvent}
                    currentUser={user}
                    onClose={handleEditorClose}
                    onSaveComplete={handleSaveComplete}
                />
            )}
        </div>
    );
};

export default EventsPage;
