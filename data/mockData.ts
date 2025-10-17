import { User, Role, Album, Story, MediaItem, EventItem } from '../types';

const now = new Date();

export const MOCK_USERS: User[] = [
  { id: '0', name: 'admin', email: 'admin@obras.com', avatar: 'https://i.pravatar.cc/150?u=admin', role: Role.ADMIN_MASTER, birthdate: '1970-01-01', status: 'APPROVED' },
  { id: '1', name: 'Mestre de Obras', email: 'master@obras.com', avatar: 'https://i.pravatar.cc/150?u=1', role: Role.ADMIN_MASTER, birthdate: '1980-06-15', status: 'APPROVED' },
  { id: '2', name: 'Engenheira Chefe', email: 'admin@obras.com', avatar: 'https://i.pravatar.cc/150?u=2', role: Role.ADMIN, birthdate: '1988-09-22', status: 'APPROVED' },
  { id: '3', name: 'Zezinho Pedreiro', email: 'membro@obras.com', avatar: 'https://i.pravatar.cc/150?u=3', role: Role.MEMBER, birthdate: '1992-04-01', status: 'APPROVED' },
  { id: '4', name: 'Estagiária Curiosa', email: 'leitor@obras.com', avatar: 'https://i.pravatar.cc/150?u=4', role: Role.READER, birthdate: '2001-11-10', status: 'APPROVED' },
  { id: '5', name: 'Maria da Betoneira', email: 'maria@obras.com', avatar: 'https://i.pravatar.cc/150?u=5', role: Role.MEMBER, birthdate: '1995-07-30', status: 'APPROVED' },
];

const MOCK_MEDIA: { [albumId: string]: MediaItem[] } = {
    'album-1': [
        { id: 'photo-1', albumId: 'album-1', url: 'https://picsum.photos/seed/bbq1/800/600', type: 'image', description: 'O mestre da churrasqueira', uploadedBy: '1', createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(), filter: undefined, taggedUsers: ['2', '3'] },
        { id: 'video-1', albumId: 'album-1', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', type: 'video', description: 'Momento de descontração', uploadedBy: '2', createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(), filter: undefined, taggedUsers: ['1', '3', '5'] },
        { id: 'photo-2', albumId: 'album-1', url: 'https://picsum.photos/seed/bbq2/800/600', type: 'image', description: 'Galera reunida', uploadedBy: '2', createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(), filter: undefined, taggedUsers: ['1', '3', '5'] },
        { id: 'photo-3', albumId: 'album-1', url: 'https://picsum.photos/seed/bbq3/800/600', type: 'image', description: 'Picanha no ponto!', uploadedBy: '3', createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(), filter: undefined, taggedUsers: [] },
    ],
    'album-2': [
        { id: 'photo-4', albumId: 'album-2', url: 'https://picsum.photos/seed/beach1/800/600', type: 'image', description: 'Pé na areia', uploadedBy: '3', createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(), filter: undefined, taggedUsers: ['4', '5'] },
        { id: 'photo-5', albumId: 'album-2', url: 'https://picsum.photos/seed/beach2/800/600', type: 'image', description: 'Castelinho de areia', uploadedBy: '4', createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(), filter: undefined, taggedUsers: ['3', '5'] },
    ],
    'album-3': [
        { id: 'photo-6', albumId: 'album-3', url: 'https://picsum.photos/seed/party1/800/600', type: 'image', description: 'Fantasia de Super-Herói', uploadedBy: '1', createdAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(), filter: undefined, taggedUsers: ['2'] },
    ],
    'album-4': [
        { id: 'photo-7', albumId: 'album-4', url: 'https://picsum.photos/seed/public1/800/600', type: 'image', description: 'Vista da cidade', uploadedBy: '2', createdAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(), filter: undefined, taggedUsers: [] },
        { id: 'photo-8', albumId: 'album-4', url: 'https://picsum.photos/seed/public2/800/600', type: 'image', description: 'Pôr do sol no parque', uploadedBy: '4', createdAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(), filter: undefined, taggedUsers: [] },
    ]
}


const EVENT_ALBUMS: Album[] = [
    // 2025
    { id: 'album-event-1', title: 'Error / Greenvalley BC', isEventAlbum: true, description: '20/abr em Greenvalley BC', coverPhoto: 'https://picsum.photos/seed/event1/800/400', createdBy: '1', createdAt: '2025-04-20T12:00:00Z', permission: Role.MEMBER, visibleTo: [], taggedUsers: [], photos: [] },
    { id: 'album-event-2', title: 'Colyn / Levels', isEventAlbum: true, description: '27/abr em Levels', coverPhoto: 'https://picsum.photos/seed/event2/800/400', createdBy: '1', createdAt: '2025-04-27T12:00:00Z', permission: Role.MEMBER, visibleTo: [], taggedUsers: [], photos: [] },
    { id: 'album-event-3', title: 'Mila Journee / Kontrol', isEventAlbum: true, description: '19/mai em Kontrol', coverPhoto: 'https://picsum.photos/seed/event3/800/400', createdBy: '1', createdAt: '2025-05-19T12:00:00Z', permission: Role.MEMBER, visibleTo: [], taggedUsers: [], photos: [] },
    { id: 'album-event-4', title: 'Illusionize / U Club', isEventAlbum: true, description: '1/jun em U Club', coverPhoto: 'https://picsum.photos/seed/event4/800/400', createdBy: '1', createdAt: '2025-06-01T12:00:00Z', permission: Role.MEMBER, visibleTo: [], taggedUsers: [], photos: [] },
    { id: 'album-event-5', title: 'STB / São Paulo', isEventAlbum: true, description: '6 e 7/jun em São Paulo', coverPhoto: 'https://picsum.photos/seed/event5/800/400', createdBy: '1', createdAt: '2025-06-06T12:00:00Z', permission: Role.MEMBER, visibleTo: [], taggedUsers: [], photos: [] },
    { id: 'album-event-6', title: 'After Run Club / São Paulo', isEventAlbum: true, description: '8/jun em São Paulo', coverPhoto: 'https://picsum.photos/seed/event6/800/400', createdBy: '1', createdAt: '2025-06-08T12:00:00Z', permission: Role.MEMBER, visibleTo: [], taggedUsers: [], photos: [] },
    { id: 'album-event-7', title: 'Cyclus / Green Park', isEventAlbum: true, description: '6/jul em Green Park', coverPhoto: 'https://picsum.photos/seed/event7/800/400', createdBy: '1', createdAt: '2025-07-06T12:00:00Z', permission: Role.MEMBER, visibleTo: [], taggedUsers: [], photos: [] },
    { id: 'album-event-8', title: 'Warung / Passo Fundo', isEventAlbum: true, description: '17/ago em Passo Fundo', coverPhoto: 'https://picsum.photos/seed/event8/800/400', createdBy: '1', createdAt: '2025-08-17T12:00:00Z', permission: Role.MEMBER, visibleTo: [], taggedUsers: [], photos: [] },
    { id: 'album-event-9', title: 'VNTG / Greenvalley Gramado', isEventAlbum: true, description: '23/ago em Greenvalley Gramado', coverPhoto: 'https://picsum.photos/seed/event9/800/400', createdBy: '1', createdAt: '2025-08-23T12:00:00Z', permission: Role.MEMBER, visibleTo: [], taggedUsers: [], photos: [] },
    { id: 'album-event-10', title: 'Cassian / Greenvalley', isEventAlbum: true, description: '14/set em Greenvalley', coverPhoto: 'https://picsum.photos/seed/event10/800/400', createdBy: '1', createdAt: '2025-09-14T12:00:00Z', permission: Role.MEMBER, visibleTo: [], taggedUsers: [], photos: [] },
    { id: 'album-event-11', title: 'Illusionize / GoodTimes', isEventAlbum: true, description: '4/out em GoodTimes', coverPhoto: 'https://picsum.photos/seed/event11/800/400', createdBy: '1', createdAt: '2025-10-04T12:00:00Z', permission: Role.MEMBER, visibleTo: [], taggedUsers: [], photos: [] },
    { id: 'album-event-12', title: 'Kolsch / Warung', isEventAlbum: true, description: '11/out em Warung', coverPhoto: 'https://picsum.photos/seed/event12/800/400', createdBy: '1', createdAt: '2025-10-11T12:00:00Z', permission: Role.MEMBER, visibleTo: [], taggedUsers: [], photos: [] },
    { id: 'album-event-13', title: 'Moving / Green Park', isEventAlbum: true, description: '12/out em Green Park', coverPhoto: 'https://picsum.photos/seed/event13/800/400', createdBy: '1', createdAt: '2025-10-12T12:00:00Z', permission: Role.MEMBER, visibleTo: [], taggedUsers: [], photos: [] },
    { id: 'album-event-14', title: 'Gabss / Kontrol', isEventAlbum: true, description: '01/nov em Kontrol', coverPhoto: 'https://picsum.photos/seed/event14/800/400', createdBy: '1', createdAt: '2025-11-01T12:00:00Z', permission: Role.MEMBER, visibleTo: [], taggedUsers: [], photos: [] },
    { id: 'album-event-15', title: 'Departamento / 4ü Sunset', isEventAlbum: true, description: '02/nov em 4ü Sunset', coverPhoto: 'https://picsum.photos/seed/event15/800/400', createdBy: '1', createdAt: '2025-11-02T12:00:00Z', permission: Role.MEMBER, visibleTo: [], taggedUsers: [], photos: [] },
    { id: 'album-event-16', title: 'Michael Bibi e Mau P / Greenvalley', isEventAlbum: true, description: '29/nov em Greenvalley', coverPhoto: 'https://picsum.photos/seed/event16/800/400', createdBy: '1', createdAt: '2025-11-29T12:00:00Z', permission: Role.MEMBER, visibleTo: [], taggedUsers: [], photos: [] },
    { id: 'album-event-17', title: 'DNA ArtCar / São Paulo', isEventAlbum: true, description: '06/dez em São Paulo', coverPhoto: 'https://picsum.photos/seed/event17/800/400', createdBy: '1', createdAt: '2025-12-06T12:00:00Z', permission: Role.MEMBER, visibleTo: [], taggedUsers: [], photos: [] },
    { id: 'album-event-18', title: 'DNA ArtCar / Expointer', isEventAlbum: true, description: '13/dez em Expointer', coverPhoto: 'https://picsum.photos/seed/event18/800/400', createdBy: '1', createdAt: '2025-12-13T12:00:00Z', permission: Role.MEMBER, visibleTo: [], taggedUsers: [], photos: [] },
    { id: 'album-event-19', title: 'Energy / Green Park', isEventAlbum: true, description: '14/dez em Green Park', coverPhoto: 'https://picsum.photos/seed/event19/800/400', createdBy: '1', createdAt: '2025-12-14T12:00:00Z', permission: Role.MEMBER, visibleTo: [], taggedUsers: [], photos: [] },
    { id: 'album-event-20', title: 'Mochakk / Privilege', isEventAlbum: true, description: '31/dez em Privilege', coverPhoto: 'https://picsum.photos/seed/event20/800/400', createdBy: '1', createdAt: '2025-12-31T12:00:00Z', permission: Role.MEMBER, visibleTo: [], taggedUsers: [], photos: [] },
    // 2026
    { id: 'album-event-21', title: 'DNA ArtCar / Greenvalley', isEventAlbum: true, description: '17/jan em Greenvalley', coverPhoto: 'https://picsum.photos/seed/event21/800/400', createdBy: '1', createdAt: '2026-01-17T12:00:00Z', permission: Role.MEMBER, visibleTo: [], taggedUsers: [], photos: [] },
    { id: 'album-event-22', title: 'VNTG / Greenvalley', isEventAlbum: true, description: '14/fev em Greenvalley', coverPhoto: 'https://picsum.photos/seed/event22/800/400', createdBy: '1', createdAt: '2026-02-14T12:00:00Z', permission: Role.MEMBER, visibleTo: [], taggedUsers: [], photos: [] },
    { id: 'album-event-23', title: 'VNTG / P12 Jurerê', isEventAlbum: true, description: '15/fev em P12 Jurerê', coverPhoto: 'https://picsum.photos/seed/event23/800/400', createdBy: '1', createdAt: '2026-02-15T12:00:00Z', permission: Role.MEMBER, visibleTo: [], taggedUsers: [], photos: [] },
    { id: 'album-event-24', title: 'Artbat e Camelphat / Greenvalley', isEventAlbum: true, description: '16/fev em Greenvalley', coverPhoto: 'https://picsum.photos/seed/event24/800/400', createdBy: '1', createdAt: '2026-02-16T12:00:00Z', permission: Role.MEMBER, visibleTo: [], taggedUsers: [], photos: [] },
    { id: 'album-event-25', title: 'Rüfüs du Sol - Curitiba', isEventAlbum: true, description: '27/fev em Curitiba', coverPhoto: 'https://picsum.photos/seed/event25/800/400', createdBy: '1', createdAt: '2026-02-27T12:00:00Z', permission: Role.MEMBER, visibleTo: [], taggedUsers: [], photos: [] },
    { id: 'album-event-26', title: 'Universo Paralelo / Bahia', isEventAlbum: true, description: '27/dez em Bahia', coverPhoto: 'https://picsum.photos/seed/event26/800/400', createdBy: '1', createdAt: '2026-12-27T12:00:00Z', permission: Role.MEMBER, visibleTo: [], taggedUsers: [], photos: [] },
];

export const MOCK_ALBUMS: Album[] = [
  { 
    id: 'album-1', 
    title: 'Churrasco na Laje',
    description: 'A confraternização da firma com muita carne e alegria!',
    coverPhoto: MOCK_MEDIA['album-1'][0].url,
    createdBy: '1', 
    createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    permission: Role.MEMBER, 
    visibleTo: [], 
    taggedUsers: ['1', '2', '3'],
    photos: MOCK_MEDIA['album-1']
  },
  { 
    id: 'album-2', 
    title: 'Viagem para a Praia', 
    description: 'Fim de semana de sol e mar com a equipe.',
    coverPhoto: MOCK_MEDIA['album-2'][0].url,
    createdBy: '3', 
    createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    permission: Role.MEMBER, 
    visibleTo: [], 
    taggedUsers: ['3', '4', '5'],
    photos: MOCK_MEDIA['album-2']
  },
  { 
    id: 'album-3', 
    title: 'Festa a Fantasia Secreta', 
    description: 'Evento exclusivo para a alta cúpula.',
    coverPhoto: MOCK_MEDIA['album-3'][0].url,
    createdBy: '1', 
    createdAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    permission: Role.ADMIN, 
    visibleTo: [], 
    taggedUsers: ['1', '2'],
    photos: MOCK_MEDIA['album-3']
  },
  { 
    id: 'album-4', 
    title: 'Fotos Públicas', 
    description: 'Registros gerais que todos podem ver.',
    coverPhoto: MOCK_MEDIA['album-4'][0].url,
    createdBy: '2', 
    createdAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    permission: Role.READER, 
    visibleTo: [], 
    taggedUsers: [],
    photos: MOCK_MEDIA['album-4']
  },
  ...EVENT_ALBUMS,
];

export const MOCK_ALBUMLESS_MEDIA: MediaItem[] = [
    { id: 'photo-noalbum-1', url: 'https://picsum.photos/seed/noalbum1/800/600', type: 'image', description: 'Post avulso, sem álbum!', uploadedBy: '3', createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(), filter: undefined, taggedUsers: ['5'] },
    { id: 'photo-noalbum-2', url: 'https://picsum.photos/seed/noalbum2/800/600', type: 'image', description: 'Outro post solto.', uploadedBy: '5', createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(), filter: undefined, taggedUsers: [] },
];


export const MOCK_STORIES: Story[] = [
    { id: 'story-1', userId: '1', filePath: 'https://picsum.photos/seed/story1/400/700', type: 'image', createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), expiresAt: new Date(now.getTime() + 22 * 60 * 60 * 1000).toISOString() },
    { id: 'story-2', userId: '3', filePath: 'https://picsum.photos/seed/story2/400/700', type: 'image', createdAt: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(), expiresAt: new Date(now.getTime() + 19 * 60 * 60 * 1000).toISOString() },
    { id: 'story-3', userId: '5', filePath: 'https://picsum.photos/seed/story3/400/700', type: 'image', createdAt: new Date(now.getTime() - 10 * 60 * 60 * 1000).toISOString(), expiresAt: new Date(now.getTime() + 14 * 60 * 60 * 1000).toISOString() },
];

export const MOCK_EVENTS: EventItem[] = [
    // 2025
    { id: 'event-1', date: '2025-04-20T12:00:00Z', title: 'Error / Greenvalley BC', location: 'Greenvalley BC', albumId: 'album-event-1' },
    { id: 'event-2', date: '2025-04-27T12:00:00Z', title: 'Colyn / Levels', location: 'Levels', albumId: 'album-event-2' },
    { id: 'event-3', date: '2025-05-19T12:00:00Z', title: 'Mila Journee / Kontrol', location: 'Kontrol', albumId: 'album-event-3' },
    { id: 'event-4', date: '2025-06-01T12:00:00Z', title: 'Illusionize / U Club', location: 'U Club', albumId: 'album-event-4' },
    { id: 'event-5', date: '2025-06-06T12:00:00Z', title: 'STB / São Paulo', location: 'São Paulo', albumId: 'album-event-5' },
    { id: 'event-6', date: '2025-06-08T12:00:00Z', title: 'After Run Club / São Paulo', location: 'São Paulo', albumId: 'album-event-6' },
    { id: 'event-7', date: '2025-07-06T12:00:00Z', title: 'Cyclus / Green Park', location: 'Green Park', albumId: 'album-event-7' },
    { id: 'event-8', date: '2025-08-17T12:00:00Z', title: 'Warung / Passo Fundo', location: 'Passo Fundo', albumId: 'album-event-8' },
    { id: 'event-9', date: '2025-08-23T12:00:00Z', title: 'VNTG / Greenvalley Gramado', location: 'Greenvalley Gramado', albumId: 'album-event-9' },
    { id: 'event-10', date: '2025-09-14T12:00:00Z', title: 'Cassian / Greenvalley', location: 'Greenvalley', albumId: 'album-event-10' },
    { id: 'event-11', date: '2025-10-04T12:00:00Z', title: 'Illusionize / GoodTimes', location: 'GoodTimes', albumId: 'album-event-11' },
    { id: 'event-12', date: '2025-10-11T12:00:00Z', title: 'Kolsch / Warung', location: 'Warung', albumId: 'album-event-12' },
    { id: 'event-13', date: '2025-10-12T12:00:00Z', title: 'Moving / Green Park', location: 'Green Park', albumId: 'album-event-13' },
    { id: 'event-14', date: '2025-11-01T12:00:00Z', title: 'Gabss / Kontrol', location: 'Kontrol', albumId: 'album-event-14' },
    { id: 'event-15', date: '2025-11-02T12:00:00Z', title: 'Departamento / 4ü Sunset', location: '4ü Sunset', albumId: 'album-event-15' },
    { id: 'event-16', date: '2025-11-29T12:00:00Z', title: 'Michael Bibi e Mau P / Greenvalley', location: 'Greenvalley', albumId: 'album-event-16' },
    { id: 'event-17', date: '2025-12-06T12:00:00Z', title: 'DNA ArtCar / São Paulo', location: 'São Paulo', albumId: 'album-event-17' },
    { id: 'event-18', date: '2025-12-13T12:00:00Z', title: 'DNA ArtCar / Expointer', location: 'Expointer', albumId: 'album-event-18' },
    { id: 'event-19', date: '2025-12-14T12:00:00Z', title: 'Energy / Green Park', location: 'Green Park', albumId: 'album-event-19' },
    { id: 'event-20', date: '2025-12-31T12:00:00Z', title: 'Mochakk / Privilege', location: 'Privilege', albumId: 'album-event-20' },
    // 2026
    { id: 'event-21', date: '2026-01-17T12:00:00Z', title: 'DNA ArtCar / Greenvalley', location: 'Greenvalley', albumId: 'album-event-21' },
    { id: 'event-22', date: '2026-02-14T12:00:00Z', title: 'VNTG / Greenvalley', location: 'Greenvalley', albumId: 'album-event-22' },
    { id: 'event-23', date: '2026-02-15T12:00:00Z', title: 'VNTG / P12 Jurerê', location: 'P12 Jurerê', albumId: 'album-event-23' },
    { id: 'event-24', date: '2026-02-16T12:00:00Z', title: 'Artbat e Camelphat / Greenvalley', location: 'Greenvalley', albumId: 'album-event-24' },
    { id: 'event-25', date: '2026-02-27T12:00:00Z', title: 'Rüfüs du Sol - Curitiba', location: 'Curitiba', albumId: 'album-event-25' },
    { id: 'event-26', date: '2026-12-27T12:00:00Z', title: 'Universo Paralelo / Bahia', location: 'Bahia', albumId: 'album-event-26' },
];