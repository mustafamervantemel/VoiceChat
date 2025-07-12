import React, { useState } from 'react';
import LoginScreen from './components/LoginScreen';
import Dashboard from './components/Dashboard';
import RoomScreen from './components/RoomScreen';
import { User, Room } from './types';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [rooms, setRooms] = useState<Room[]>([
    {
      id: '1',
      title: 'Teknoloji Sohbeti',
      description: 'Yazılım geliştirme ve teknoloji trendleri hakkında konuşalım',
      isPrivate: false,
      participants: [],
      speakers: [],
      host: 'admin',
      createdAt: new Date(),
    },
    {
      id: '2',
      title: 'Girişimcilik',
      description: 'Start-up deneyimleri ve iş fikirleri',
      isPrivate: false,
      participants: [],
      speakers: [],
      host: 'admin',
      createdAt: new Date(),
    },
  ]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentRoom(null);
  };

  const handleJoinRoom = (room: Room) => {
    if (!currentUser) return;
    
    const updatedRoom = {
      ...room,
      participants: [...room.participants, currentUser.id],
    };
    
    setRooms(rooms.map(r => r.id === room.id ? updatedRoom : r));
    setCurrentRoom(updatedRoom);
  };

  const handleLeaveRoom = () => {
    if (!currentRoom || !currentUser) return;
    
    const updatedRoom = {
      ...currentRoom,
      participants: currentRoom.participants.filter(p => p !== currentUser.id),
      speakers: currentRoom.speakers.filter(s => s !== currentUser.id),
    };
    
    setRooms(rooms.map(r => r.id === currentRoom.id ? updatedRoom : r));
    setCurrentRoom(null);
  };

  const handleCreateRoom = (roomData: Omit<Room, 'id' | 'participants' | 'speakers' | 'createdAt'>) => {
    if (!currentUser) return;
    
    const newRoom: Room = {
      ...roomData,
      id: Date.now().toString(),
      participants: [currentUser.id],
      speakers: [currentUser.id],
      createdAt: new Date(),
    };
    
    setRooms([...rooms, newRoom]);
    setCurrentRoom(newRoom);
  };

  const handleToggleSpeaker = (userId: string) => {
    if (!currentRoom || !currentUser) return;
    
    const updatedRoom = {
      ...currentRoom,
      speakers: currentRoom.speakers.includes(userId)
        ? currentRoom.speakers.filter(s => s !== userId)
        : [...currentRoom.speakers, userId],
    };
    
    setRooms(rooms.map(r => r.id === currentRoom.id ? updatedRoom : r));
    setCurrentRoom(updatedRoom);
  };

  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  if (currentRoom) {
    return (
      <RoomScreen
        room={currentRoom}
        currentUser={currentUser}
        onLeaveRoom={handleLeaveRoom}
        onToggleSpeaker={handleToggleSpeaker}
      />
    );
  }

  return (
    <Dashboard
      user={currentUser}
      rooms={rooms}
      onJoinRoom={handleJoinRoom}
      onCreateRoom={handleCreateRoom}
      onLogout={handleLogout}
    />
  );
}

export default App;