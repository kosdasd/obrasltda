export enum Role {
  ADMIN_MASTER = 'ADMIN_MASTER',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
  READER = 'READER',
}

export interface User {
  id: string;
  name: string;
  email?: string;
  avatar: string;
  role: Role;
  birthdate?: string;
  status: 'PENDING' | 'APPROVED';
}

export interface MediaItem {
  id:string;
  albumId?: string;
  url: string;
  type: 'image' | 'video';
  description: string;
  uploadedBy: string; // userId
  createdAt: string;
  filter?: string;
  taggedUsers?: string[];
}

export interface Album {
  id: string;
  title: string;
  description: string;
  coverPhoto: string;
  createdBy: string; // userId
  createdAt: string;
  permission: Role;
  visibleTo: string[];
  taggedUsers: string[];
  photos: MediaItem[];
  isEventAlbum?: boolean;
}

export interface Story {
  id: string;
  userId: string;
  filePath: string;
  type: 'image' | 'video';
  createdAt: string;
  expiresAt: string;
}

export interface EventItem {
  id: string;
  date: string; // ISO Date String
  title: string;
  location: string;
  albumId: string;
}

// Keep Photo as an alias for backward compatibility if needed, but we'll primarily use MediaItem
export type Photo = MediaItem;