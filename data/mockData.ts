import { User, Role, Album, Story, MediaItem } from '../types';

const now = new Date();

export const MOCK_USERS: User[] = [
  { id: '1', name: 'Mestre de Obras', email: 'master@obras.com', avatar: 'https://i.pravatar.cc/150?u=1', role: Role.ADMIN_MASTER },
  { id: '2', name: 'Engenheira Chefe', email: 'admin@obras.com', avatar: 'https://i.pravatar.cc/150?u=2', role: Role.ADMIN },
  { id: '3', name: 'Zezinho Pedreiro', email: 'membro@obras.com', avatar: 'https://i.pravatar.cc/150?u=3', role: Role.MEMBER },
  { id: '4', name: 'Estagiária Curiosa', email: 'leitor@obras.com', avatar: 'https://i.pravatar.cc/150?u=4', role: Role.READER },
  { id: '5', name: 'Maria da Betoneira', email: 'maria@obras.com', avatar: 'https://i.pravatar.cc/150?u=5', role: Role.MEMBER },
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