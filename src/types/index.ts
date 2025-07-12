export interface User {
  id: string;
  username: string;
  email?: string;
  isGuest: boolean;
  avatar?: string;
  joinedAt: Date;
}

export interface Room {
  id: string;
  title: string;
  description: string;
  isPrivate: boolean;
  participants: string[];
  speakers: string[];
  host: string;
  createdAt: Date;
  maxParticipants?: number;
}