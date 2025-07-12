import React, { useState, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Users, 
  Hand, 
  Settings,
  LogOut,
  Crown,
  UserCheck,
  UserX
} from 'lucide-react';
import { User, Room } from '../types';

interface RoomScreenProps {
  room: Room;
  currentUser: User;
  onLeaveRoom: () => void;
  onToggleSpeaker: (userId: string) => void;
}

const RoomScreen: React.FC<RoomScreenProps> = ({
  room,
  currentUser,
  onLeaveRoom,
  onToggleSpeaker,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);

  const isHost = room.host === currentUser.id;
  const isSpeaker = room.speakers.includes(currentUser.id);
  const isListener = !isSpeaker;

  // Mock participants data - in real app, this would come from the backend
  const mockParticipants = [
    { id: '1', username: 'Ali Veli', isGuest: false, avatar: '' },
    { id: '2', username: 'Ayşe K.', isGuest: true, avatar: '' },
    { id: '3', username: 'Mehmet D.', isGuest: false, avatar: '' },
    { id: currentUser.id, username: currentUser.username, isGuest: currentUser.isGuest, avatar: '' },
  ];

  const speakers = mockParticipants.filter(p => room.speakers.includes(p.id));
  const listeners = mockParticipants.filter(p => !room.speakers.includes(p.id));

  const handleMicToggle = () => {
    if (isSpeaker) {
      setIsMuted(!isMuted);
      // VideoSDK mic toggle would go here
    }
  };

  const handleDeafenToggle = () => {
    setIsDeafened(!isDeafened);
    // VideoSDK audio toggle would go here
  };

  const handleRaiseHand = () => {
    if (isListener) {
      setHandRaised(!handRaised);
      // Send hand raise signal to host
    }
  };

  const handleRequestToSpeak = () => {
    if (isListener && !handRaised) {
      setHandRaised(true);
      // Request speaker permission from host
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white">
      {/* Header */}
      <header className="bg-black bg-opacity-20 backdrop-blur-lg border-b border-white border-opacity-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onLeaveRoom}
                className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
              <div>
                <h1 className="font-semibold text-lg">{room.title}</h1>
                <p className="text-purple-200 text-sm">{room.description}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowParticipants(!showParticipants)}
                className="flex items-center space-x-2 bg-white bg-opacity-10 px-3 py-2 rounded-lg hover:bg-opacity-20 transition-colors"
              >
                <Users className="w-4 h-4" />
                <span className="text-sm">{room.participants.length}</span>
              </button>
              <button className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Speakers Section */}
          <div className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <Mic className="w-5 h-5 mr-2" />
                Konuşmacılar ({speakers.length})
              </h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {speakers.map((speaker) => (
                  <div key={speaker.id} className="text-center">
                    <div className="relative mb-3">
                      <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-xl font-semibold transition-all duration-200 ${
                        speaker.id === currentUser.id && !isMuted
                          ? 'bg-green-500 ring-4 ring-green-300'
                          : speaker.id === currentUser.id && isMuted
                          ? 'bg-red-500 ring-4 ring-red-300'
                          : 'bg-purple-600'
                      }`}>
                        {speaker.username.charAt(0).toUpperCase()}
                      </div>
                      
                      {room.host === speaker.id && (
                        <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-1">
                          <Crown className="w-3 h-3" />
                        </div>
                      )}
                      
                      {speaker.id === currentUser.id && isMuted && (
                        <div className="absolute -bottom-1 -right-1 bg-red-500 rounded-full p-1">
                          <MicOff className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                    
                    <p className="text-sm font-medium">{speaker.username}</p>
                    {speaker.isGuest && (
                      <p className="text-xs text-purple-300">Misafir</p>
                    )}
                    
                    {isHost && speaker.id !== currentUser.id && (
                      <button
                        onClick={() => onToggleSpeaker(speaker.id)}
                        className="mt-2 text-xs bg-red-500 hover:bg-red-600 px-2 py-1 rounded transition-colors"
                      >
                        Dinleyici Yap
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Listeners Preview */}
              {listeners.length > 0 && (
                <div className="mt-12">
                  <h3 className="text-lg font-medium mb-4 flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    Dinleyiciler ({listeners.length})
                  </h3>
                  
                  <div className="flex flex-wrap gap-2">
                    {listeners.slice(0, 10).map((listener) => (
                      <div key={listener.id} className="flex items-center space-x-2 bg-white bg-opacity-10 px-3 py-2 rounded-lg">
                        <div className="w-6 h-6 bg-purple-400 rounded-full flex items-center justify-center text-xs">
                          {listener.username.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm">{listener.username}</span>
                        {handRaised && listener.id === currentUser.id && (
                          <Hand className="w-4 h-4 text-yellow-400" />
                        )}
                        
                        {isHost && (
                          <button
                            onClick={() => onToggleSpeaker(listener.id)}
                            className="text-xs bg-green-500 hover:bg-green-600 px-2 py-1 rounded transition-colors"
                          >
                            <UserCheck className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ))}
                    
                    {listeners.length > 10 && (
                      <div className="bg-white bg-opacity-10 px-3 py-2 rounded-lg text-sm">
                        +{listeners.length - 10} daha
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="bg-black bg-opacity-30 backdrop-blur-lg p-4">
            <div className="max-w-md mx-auto">
              <div className="flex justify-center space-x-4">
                {isSpeaker && (
                  <button
                    onClick={handleMicToggle}
                    className={`p-4 rounded-full transition-all duration-200 ${
                      isMuted
                        ? 'bg-red-500 hover:bg-red-600'
                        : 'bg-green-500 hover:bg-green-600'
                    }`}
                  >
                    {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                  </button>
                )}
                
                <button
                  onClick={handleDeafenToggle}
                  className={`p-4 rounded-full transition-all duration-200 ${
                    isDeafened
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-gray-600 hover:bg-gray-700'
                  }`}
                >
                  {isDeafened ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                </button>
                
                {isListener && (
                  <button
                    onClick={handleRaiseHand}
                    className={`p-4 rounded-full transition-all duration-200 ${
                      handRaised
                        ? 'bg-yellow-500 hover:bg-yellow-600'
                        : 'bg-gray-600 hover:bg-gray-700'
                    }`}
                  >
                    <Hand className="w-6 h-6" />
                  </button>
                )}
                
                <button
                  onClick={onLeaveRoom}
                  className="p-4 rounded-full bg-red-500 hover:bg-red-600 transition-all duration-200"
                >
                  <LogOut className="w-6 h-6" />
                </button>
              </div>
              
              <div className="text-center mt-4">
                <p className="text-sm text-purple-200">
                  {isSpeaker ? 'Konuşmacısınız' : handRaised ? 'El kaldırdınız' : 'Dinleyicisiniz'}
                </p>
                {isListener && !handRaised && (
                  <button
                    onClick={handleRequestToSpeak}
                    className="mt-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm transition-colors"
                  >
                    Konuşma İsteği Gönder
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Participants Sidebar */}
        {showParticipants && (
          <div className="w-80 bg-black bg-opacity-30 backdrop-blur-lg border-l border-white border-opacity-10 p-4">
            <h3 className="font-semibold mb-4">Katılımcılar</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-purple-200 mb-2">
                  Konuşmacılar ({speakers.length})
                </h4>
                <div className="space-y-2">
                  {speakers.map((speaker) => (
                    <div key={speaker.id} className="flex items-center justify-between p-2 bg-white bg-opacity-5 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-sm">
                          {speaker.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{speaker.username}</p>
                          {speaker.isGuest && <p className="text-xs text-purple-300">Misafir</p>}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        {room.host === speaker.id && <Crown className="w-4 h-4 text-yellow-500" />}
                        <Mic className="w-4 h-4 text-green-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-purple-200 mb-2">
                  Dinleyiciler ({listeners.length})
                </h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {listeners.map((listener) => (
                    <div key={listener.id} className="flex items-center justify-between p-2 bg-white bg-opacity-5 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-purple-400 rounded-full flex items-center justify-center text-sm">
                          {listener.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{listener.username}</p>
                          {listener.isGuest && <p className="text-xs text-purple-300">Misafir</p>}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        {handRaised && listener.id === currentUser.id && (
                          <Hand className="w-4 h-4 text-yellow-400" />
                        )}
                        {isHost && (
                          <button
                            onClick={() => onToggleSpeaker(listener.id)}
                            className="text-green-500 hover:text-green-400 transition-colors"
                          >
                            <UserCheck className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomScreen;