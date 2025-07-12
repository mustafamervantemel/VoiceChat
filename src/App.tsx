import React, { useState } from 'react';
import LoginScreen from './components/LoginScreen';
import { MessageCircle, Heart, Star, X, RotateCcw, Settings, User, Send, Smile, Camera, Mic, Phone, Video, Gift, Filter } from 'lucide-react';

interface AppUser {
  id: string;
  name: string;
  email: string;
  age?: number;
  bio?: string;
  photos?: string[];
}

interface ProfileUser {
  id: string;
  name: string;
  age: number;
  photos: string[];
  bio: string;
  location: string;
  interests: string[];
  job?: string;
  education?: string;
  distance: number;
  isOnline: boolean;
  verified: boolean;
  lastMessage?: string;
}

interface Message {
  id: string;
  senderId: string;
  text?: string;
  type: 'text' | 'voice' | 'image' | 'gift';
  voiceDuration?: number;
  imageUrl?: string;
  giftType?: string;
  timestamp: Date;
  isRead: boolean;
}

interface Chat {
  id: string;
  userId: string;
  messages: Message[];
  lastMessage: Message;
}

function App() {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [currentView, setCurrentView] = useState<'discover' | 'messages' | 'likes' | 'profile' | 'chat' | 'video-call'>('discover');
  const [selectedChatUser, setSelectedChatUser] = useState<ProfileUser | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    ageRange: [18, 35],
    distance: 50,
    interests: [] as string[],
    verified: false
  });
  
  const profileUsers: ProfileUser[] = [
    {
      id: '1',
      name: 'Emma',
      age: 25,
      photos: ['👩🏻‍🦱', '🌸', '📚'],
      bio: 'Love traveling, reading, and good coffee ☕️ Looking for someone to explore the city with!',
      location: 'İstanbul, Türkiye',
      interests: ['Travel', 'Books', 'Coffee', 'Photography'],
      job: 'Graphic Designer',
      education: 'Boğaziçi University',
      distance: 2,
      isOnline: true,
      verified: true,
      lastMessage: "Hey! How are you doing? 😊"
    },
    {
      id: '2',
      name: 'Sophia',
      age: 23,
      photos: ['👩🏼', '🎨', '🌿'],
      bio: 'Artist by day, dreamer by night 🎨 Love nature and meaningful conversations',
      location: 'Ankara, Türkiye',
      interests: ['Art', 'Nature', 'Music', 'Yoga'],
      job: 'Artist',
      education: 'METU',
      distance: 5,
      isOnline: true,
      verified: false,
      lastMessage: "Would love to chat more!"
    },
    {
      id: '3',
      name: 'Isabella',
      age: 28,
      photos: ['👩🏽', '🏃‍♀️', '🍝'],
      bio: 'Fitness enthusiast and foodie 🏃‍♀️🍝 Life is too short for boring conversations!',
      location: 'İzmir, Türkiye',
      interests: ['Fitness', 'Cooking', 'Movies', 'Dancing'],
      job: 'Nutritionist',
      education: 'Ege University',
      distance: 12,
      isOnline: false,
      verified: true,
      lastMessage: "That sounds amazing! Tell me more"
    },
    {
      id: '4',
      name: 'Olivia',
      age: 26,
      photos: ['👩🏻', '🎵', '🌅'],
      bio: 'Music lover and early bird 🎵🌅 Always up for new adventures and good vibes',
      location: 'Bursa, Türkiye',
      interests: ['Music', 'Hiking', 'Photography', 'Concerts'],
      job: 'Music Teacher',
      education: 'Uludağ University',
      distance: 8,
      isOnline: true,
      verified: false,
      lastMessage: "I love that song too! 🎵"
    },
    {
      id: '5',
      name: 'Zara',
      age: 24,
      photos: ['👩🏻‍💼', '📱', '✈️'],
      bio: 'Tech enthusiast and world traveler 📱✈️ Building the future, one app at a time',
      location: 'İstanbul, Türkiye',
      interests: ['Technology', 'Travel', 'Startups', 'Innovation'],
      job: 'Software Engineer',
      education: 'İTÜ',
      distance: 3,
      isOnline: true,
      verified: true,
      lastMessage: "That's so cool! I work in tech too"
    }
  ];

  const [discoveredUsers] = useState(profileUsers);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [likedUsers, setLikedUsers] = useState<ProfileUser[]>([]);
  const [matches, setMatches] = useState<ProfileUser[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);

  const handleLogin = (user: AppUser) => {
    setCurrentUser(user);
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    const currentUserProfile = discoveredUsers[currentCardIndex];
    
    if (direction === 'right') {
      setLikedUsers(prev => [...prev, currentUserProfile]);
      
      // Simulate match (50% chance)
      if (Math.random() > 0.5) {
        setMatches(prev => [...prev, currentUserProfile]);
        // Create initial chat
        const newChat: Chat = {
          id: `chat-${currentUserProfile.id}`,
          userId: currentUserProfile.id,
          messages: [],
          lastMessage: {
            id: 'initial',
            senderId: currentUserProfile.id,
            text: currentUserProfile.lastMessage || "Hi! 👋",
            type: 'text',
            timestamp: new Date(),
            isRead: false
          }
        };
        setChats(prev => [...prev, newChat]);
      }
    }
    
    setCurrentCardIndex(prev => prev + 1);
  };

  const handleSendMessage = (type: 'text' | 'voice' | 'image' | 'gift' = 'text', content?: any) => {
    if (!selectedChatUser) return;
    if (type === 'text' && !newMessage.trim()) return;
    
    const message: Message = {
      id: Date.now().toString(),
      senderId: currentUser!.id,
      type,
      timestamp: new Date(),
      isRead: true
    };

    if (type === 'text') {
      message.text = newMessage;
    } else if (type === 'voice') {
      message.voiceDuration = content || 3; // Default 3 seconds
    } else if (type === 'image') {
      message.imageUrl = content || '🖼️';
    } else if (type === 'gift') {
      message.giftType = content || '🎁';
    }

    setChats(prev => 
      prev.map(chat => 
        chat.userId === selectedChatUser.id 
          ? { ...chat, messages: [...chat.messages, message], lastMessage: message }
          : chat
      )
    );

    if (type === 'text') setNewMessage('');

    // Simulate response after 2 seconds
    setTimeout(() => {
      const responses = [
        "That's interesting! Tell me more 😊",
        "I totally agree with you!",
        "Haha, you're funny! 😄",
        "What do you think about...?",
        "I'd love to hear your thoughts on that",
        "Same here! We have so much in common"
      ];
      
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        senderId: selectedChatUser.id,
        type: 'text',
        text: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
        isRead: false
      };

      setChats(prev => 
        prev.map(chat => 
          chat.userId === selectedChatUser.id 
            ? { ...chat, messages: [...chat.messages, responseMessage], lastMessage: responseMessage }
            : chat
        )
      );
    }, 2000);
  };

  const handleVoiceRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      // Simulate voice message
      handleSendMessage('voice', Math.floor(Math.random() * 10) + 1);
    } else {
      setIsRecording(true);
      // Auto stop after 5 seconds for demo
      setTimeout(() => {
        setIsRecording(false);
        handleSendMessage('voice', 5);
      }, 5000);
    }
  };

  const handleVideoCall = () => {
    setCurrentView('video-call');
  };

  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  const currentCard = discoveredUsers[currentCardIndex];

  if (currentView === 'video-call' && selectedChatUser) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden">
        {/* Video Call Interface */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-900/50 to-purple-900/50">
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-white">
              <div className="w-48 h-48 mx-auto mb-6 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-8xl">
                {selectedChatUser.photos[0]}
              </div>
              <h2 className="text-3xl font-bold mb-2">{selectedChatUser.name}</h2>
              <p className="text-xl text-white/80 mb-8">Aranıyor...</p>
            </div>
          </div>
        </div>

        {/* Call Controls */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-6">
          <button 
            onClick={() => setCurrentView('chat')}
            className="w-16 h-16 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
          <button className="w-16 h-16 bg-gray-600 text-white rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
            <Mic className="w-8 h-8" />
          </button>
          <button className="w-16 h-16 bg-gray-600 text-white rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
            <Video className="w-8 h-8" />
          </button>
        </div>

        {/* User Video (Small) */}
        <div className="absolute top-8 right-8 w-32 h-48 bg-gray-800 rounded-2xl overflow-hidden">
          <div className="h-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-4xl">
            👤
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'chat' && selectedChatUser) {
    const currentChat = chats.find(chat => chat.userId === selectedChatUser.id);
    
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 flex items-center space-x-3">
            <button 
              onClick={() => setCurrentView('messages')}
              className="text-white/80 hover:text-white"
            >
              ←
            </button>
            <div className="relative">
              <div className="w-10 h-10 text-lg bg-white/20 rounded-full flex items-center justify-center">
                {selectedChatUser.photos[0]}
              </div>
              {selectedChatUser.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
              )}
            </div>
            <div className="flex-1">
              <h2 className="font-semibold">{selectedChatUser.name}</h2>
              <p className="text-xs text-white/80">
                {selectedChatUser.isOnline ? 'Online' : 'Son görülme: 2 saat önce'}
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 space-y-3 overflow-y-auto">
            {currentChat?.messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-2xl ${
                    message.senderId === currentUser.id
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {message.type === 'text' && (
                    <p className="text-sm">{message.text}</p>
                  )}
                  
                  {message.type === 'voice' && (
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                        <Mic className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="h-1 bg-white/30 rounded-full">
                          <div className="h-full bg-white/60 rounded-full w-3/4"></div>
                        </div>
                        <p className="text-xs mt-1">{message.voiceDuration}s</p>
                      </div>
                    </div>
                  )}
                  
                  {message.type === 'image' && (
                    <div className="text-center">
                      <div className="text-4xl mb-2">{message.imageUrl}</div>
                      <p className="text-xs">Fotoğraf</p>
                    </div>
                  )}
                  
                  {message.type === 'gift' && (
                    <div className="text-center">
                      <div className="text-4xl mb-2">{message.giftType}</div>
                      <p className="text-xs">Hediye gönderildi</p>
                    </div>
                  )}
                  
                  <p className={`text-xs mt-1 ${
                    message.senderId === currentUser.id ? 'text-white/70' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t">
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => handleSendMessage('image', '📸')}
                className="text-gray-400 hover:text-gray-600"
              >
                <Camera className="w-5 h-5" />
              </button>
              <button 
                onClick={() => handleSendMessage('gift', '🎁')}
                className="text-gray-400 hover:text-gray-600"
              >
                <Gift className="w-5 h-5" />
              </button>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage('text')}
                  placeholder="Mesaj yazın..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <Smile className="w-5 h-5" />
                </button>
              </div>
              <button 
                onClick={handleVoiceRecord}
                className={`p-2 rounded-full transition-all ${
                  isRecording 
                    ? 'bg-red-500 text-white animate-pulse' 
                    : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700'
                }`}
              >
                <Mic className="w-5 h-5" />
              </button>
              {newMessage.trim() && (
                <button 
                  onClick={() => handleSendMessage('text')}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-2 rounded-full hover:from-pink-600 hover:to-purple-700 transition-all"
                >
                  <Send className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 lg:bg-gradient-to-br lg:from-pink-50 lg:to-purple-50">
      <div className="max-w-md lg:max-w-7xl mx-auto bg-white min-h-screen lg:rounded-2xl lg:my-4 lg:shadow-2xl lg:overflow-hidden">
        
        {/* Desktop Layout */}
        <div className="hidden lg:flex h-screen">
          {/* Sidebar */}
          <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
            {/* Sidebar Header */}
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold">SUGO</h1>
                <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
                  <Settings className="w-6 h-6" />
                </button>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">
                  👤
                </div>
                <div>
                  <h2 className="font-semibold">{currentUser.name}</h2>
                  <p className="text-white/80 text-sm">{currentUser.email}</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="p-4 space-y-2">
              <button
                onClick={() => setCurrentView('discover')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                  currentView === 'discover' ? 'bg-pink-50 text-pink-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Heart className="w-5 h-5" />
                <span className="font-medium">Keşfet</span>
              </button>
              
              <button
                onClick={() => setCurrentView('messages')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors relative ${
                  currentView === 'messages' ? 'bg-pink-50 text-pink-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <MessageCircle className="w-5 h-5" />
                <span className="font-medium">Mesajlar</span>
                {matches.length > 0 && (
                  <div className="absolute right-3 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
                    {matches.length}
                  </div>
                )}
              </button>
              
              <button
                onClick={() => setCurrentView('likes')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                  currentView === 'likes' ? 'bg-pink-50 text-pink-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Star className="w-5 h-5" />
                <span className="font-medium">Beğeniler</span>
              </button>
              
              <button
                onClick={() => setCurrentView('profile')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                  currentView === 'profile' ? 'bg-pink-50 text-pink-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <User className="w-5 h-5" />
                <span className="font-medium">Profil</span>
              </button>
            </div>

            {/* Sidebar Content based on view */}
            <div className="flex-1 overflow-y-auto">
              {currentView === 'messages' && matches.length > 0 && (
                <div className="p-4 space-y-3">
                  <h3 className="font-semibold text-gray-800 mb-3">Sohbetler</h3>
                  {matches.map((user) => {
                    const chat = chats.find(c => c.userId === user.id);
                    return (
                      <div 
                        key={user.id}
                        onClick={() => setSelectedChatUser(user)}
                        className={`p-3 rounded-xl cursor-pointer transition-colors ${
                          selectedChatUser?.id === user.id ? 'bg-pink-50 border border-pink-200' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <div className="w-10 h-10 text-lg bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center">
                              {user.photos[0]}
                            </div>
                            {user.isOnline && (
                              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-1">
                              <p className="font-medium text-gray-800 text-sm">{user.name}</p>
                              {user.verified && <Star className="w-3 h-3 text-yellow-500 fill-current" />}
                            </div>
                            <p className="text-xs text-gray-500 truncate">
                              {chat?.lastMessage.text || user.lastMessage}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {currentView === 'discover' && (
              <div className="flex-1 flex flex-col">
                {/* Filter Bar */}
                <div className="p-4 bg-white border-b flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-800">Keşfet</h2>
                  <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Filter className="w-4 h-4" />
                    <span>Filtreler</span>
                  </button>
                </div>

                {showFilters && (
                  <div className="p-4 bg-gray-50 border-b">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Yaş Aralığı: {filters.ageRange[0]}-{filters.ageRange[1]}
                        </label>
                        <input
                          type="range"
                          min="18"
                          max="65"
                          value={filters.ageRange[1]}
                          onChange={(e) => setFilters(prev => ({
                            ...prev,
                            ageRange: [prev.ageRange[0], parseInt(e.target.value)]
                          }))}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mesafe: {filters.distance} km
                        </label>
                        <input
                          type="range"
                          min="1"
                          max="100"
                          value={filters.distance}
                          onChange={(e) => setFilters(prev => ({
                            ...prev,
                            distance: parseInt(e.target.value)
                          }))}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={filters.verified}
                            onChange={(e) => setFilters(prev => ({
                              ...prev,
                              verified: e.target.checked
                            }))}
                            className="rounded"
                          />
                          <span className="text-sm text-gray-700">Sadece doğrulanmış profiller</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex-1 flex items-center justify-center p-8">
                  {currentCard ? (
                    <div className="max-w-md w-full">
                      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                        {/* Card Image */}
                        <div className="h-96 bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center relative">
                          <div className="text-8xl">{currentCard.photos[0]}</div>
                          {currentCard.verified && (
                            <div className="absolute top-4 right-4 bg-blue-500 text-white p-2 rounded-full">
                              <Star className="w-4 h-4 fill-current" />
                            </div>
                          )}
                          {currentCard.isOnline && (
                            <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                              Online
                            </div>
                          )}
                        </div>
                        
                        {/* Card Info */}
                        <div className="p-6">
                          <div className="flex items-center space-x-2 mb-2">
                            <h2 className="text-2xl font-bold text-gray-800">
                              {currentCard.name}, {currentCard.age}
                            </h2>
                          </div>
                          
                          <p className="text-gray-600 mb-2">📍 {currentCard.distance} km uzakta</p>
                          <p className="text-gray-600 mb-3">{currentCard.job} • {currentCard.education}</p>
                          <p className="text-gray-700 text-sm mb-4">{currentCard.bio}</p>
                          
                          <div className="flex flex-wrap gap-2 mb-6">
                            {currentCard.interests.map((interest, index) => (
                              <span 
                                key={index}
                                className="px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-sm font-medium"
                              >
                                {interest}
                              </span>
                            ))}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex justify-center space-x-6">
                            <button 
                              onClick={() => handleSwipe('left')}
                              className="w-16 h-16 bg-white text-red-500 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center border-2 border-red-100"
                            >
                              <X className="w-8 h-8" />
                            </button>
                            <button 
                              onClick={() => handleSwipe('right')}
                              className="w-16 h-16 bg-white text-green-500 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center border-2 border-green-100"
                            >
                              <Heart className="w-8 h-8" />
                            </button>
                            <button className="w-16 h-16 bg-white text-blue-500 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center border-2 border-blue-100">
                              <Star className="w-8 h-8 fill-current" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="text-8xl mb-6">💝</div>
                      <h2 className="text-3xl font-bold text-gray-800 mb-4">Hiç kimse kalmadı!</h2>
                      <p className="text-gray-600 mb-8 text-lg">Yeni insanları keşfetmek için biraz bekleyin</p>
                      <button 
                        onClick={() => setCurrentCardIndex(0)}
                        className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:from-pink-600 hover:to-purple-700 transition-all flex items-center space-x-3 mx-auto"
                      >
                        <RotateCcw className="w-6 h-6" />
                        <span>Tekrar Başla</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {currentView === 'messages' && selectedChatUser && (
              <div className="flex-1 flex flex-col">
                {/* Chat Header */}
                <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-12 h-12 text-2xl bg-white/20 rounded-full flex items-center justify-center">
                      {selectedChatUser.photos[0]}
                    </div>
                    {selectedChatUser.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h2 className="font-semibold text-lg">{selectedChatUser.name}</h2>
                    <p className="text-white/80">
                      {selectedChatUser.isOnline ? 'Online' : 'Son görülme: 2 saat önce'}
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => alert('Sesli arama başlatıldı')}
                      className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                    >
                      <Phone className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={handleVideoCall}
                      className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                    >
                      <Video className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-gray-50">
                  {chats.find(chat => chat.userId === selectedChatUser.id)?.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                          message.senderId === currentUser.id
                            ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                            : 'bg-white text-gray-800 shadow-sm'
                        }`}
                      >
                        <p>{message.text}</p>
                        <p className={`text-xs mt-2 ${
                          message.senderId === currentUser.id ? 'text-white/70' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 bg-white border-t">
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={() => handleSendMessage('image', '📸')}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Camera className="w-6 h-6" />
                    </button>
                    <button 
                      onClick={() => handleSendMessage('gift', '🎁')}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Gift className="w-6 h-6" />
                    </button>
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage('text')}
                        placeholder="Mesaj yazın..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      />
                      <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        <Smile className="w-5 h-5" />
                      </button>
                    </div>
                    <button 
                      onClick={() => handleSendMessage('text')}
                      disabled={!newMessage.trim()}
                      className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:from-pink-600 hover:to-purple-700 transition-all"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {currentView === 'messages' && !selectedChatUser && (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-8xl mb-6">💬</div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Bir sohbet seçin</h2>
                  <p className="text-gray-600">Sol taraftan sohbet etmek istediğiniz kişiyi seçin</p>
                </div>
              </div>
            )}

            {currentView === 'likes' && (
              <div className="flex-1 p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Beğenileriniz</h2>
                
                {likedUsers.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="text-8xl mb-6">💖</div>
                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">Henüz beğeni yok</h3>
                    <p className="text-gray-600 text-lg">Keşfet sayfasında profilleri beğenmeye başlayın!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {likedUsers.map((user) => (
                      <div key={user.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                        <div className="aspect-square bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center">
                          <div className="text-6xl">{user.photos[0]}</div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-800">{user.name}, {user.age}</h3>
                          <p className="text-sm text-gray-500">{user.location}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {currentView === 'profile' && (
              <div className="flex-1 p-6">
                <div className="max-w-2xl mx-auto">
                  <div className="text-center mb-8">
                    <div className="w-32 h-32 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-6xl mx-auto mb-6">
                      👤
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800">{currentUser.name}</h2>
                    <p className="text-gray-600 text-lg">{currentUser.email}</p>
                  </div>

                  {/* Premium Section */}
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-6 mb-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-bold mb-2">🌟 Premium'a Geç</h3>
                        <p className="text-yellow-100">Sınırsız beğeni, süper like ve premium filtreler!</p>
                      </div>
                      <button className="bg-white text-orange-500 px-6 py-3 rounded-xl font-bold hover:bg-yellow-50 transition-colors">
                        Upgrade
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">Hesap Bilgileri</h3>
                      <div className="space-y-3 text-gray-600">
                        <p>Yaş: {currentUser.age || 'Belirtilmemiş'}</p>
                        <p>Üyelik: Mart 2024</p>
                        <p>Plan: Ücretsiz</p>
                        <p>Durum: Aktif</p>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">İstatistikler</h3>
                      <div className="space-y-3 text-gray-600">
                        <p>Toplam beğeni: {likedUsers.length}</p>
                        <p>Eşleşme: {matches.length}</p>
                        <p>Mesaj: {chats.reduce((acc, chat) => acc + chat.messages.length, 0)}</p>
                        <p>Süper Like: 5/gün</p>
                      </div>
                    </div>
                  </div>

                  {/* Settings */}
                  <div className="mt-8 space-y-4">
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">Ayarlar</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700">Profil Görünürlüğü</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
                          </label>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700">Mesaj Bildirimleri</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
                          </label>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700">Eşleşme Bildirimleri</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 text-center">
                    <button className="bg-red-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors">
                      Çıkış Yap
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden">
          {/* Mobile Header */}
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">SUGO</h1>
              <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
                <Settings className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Mobile Content */}
          <div className="pb-20">
            {currentView === 'discover' && (
              <div className="relative h-[calc(100vh-200px)] overflow-hidden">
                {currentCard ? (
                  <div className="absolute inset-4">
                    <div className="bg-white rounded-3xl shadow-2xl h-full overflow-hidden">
                      {/* Card Image */}
                      <div className="h-2/3 bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center relative">
                        <div className="text-8xl">{currentCard.photos[0]}</div>
                        {currentCard.verified && (
                          <div className="absolute top-4 right-4 bg-blue-500 text-white p-2 rounded-full">
                            <Star className="w-4 h-4 fill-current" />
                          </div>
                        )}
                        {currentCard.isOnline && (
                          <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            Online
                          </div>
                        )}
                      </div>
                      
                      {/* Card Info */}
                      <div className="p-6 h-1/3 overflow-y-auto">
                        <div className="flex items-center space-x-2 mb-2">
                          <h2 className="text-2xl font-bold text-gray-800">
                            {currentCard.name}, {currentCard.age}
                          </h2>
                        </div>
                        
                        <p className="text-gray-600 mb-2">📍 {currentCard.distance} km uzakta</p>
                        <p className="text-gray-600 mb-3">{currentCard.job} • {currentCard.education}</p>
                        <p className="text-gray-700 text-sm mb-3">{currentCard.bio}</p>
                        
                        <div className="flex flex-wrap gap-2">
                          {currentCard.interests.slice(0, 3).map((interest, index) => (
                            <span 
                              key={index}
                              className="px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-sm font-medium"
                            >
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-6">
                      <button 
                        onClick={() => handleSwipe('left')}
                        className="w-14 h-14 bg-white text-red-500 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center"
                      >
                        <X className="w-7 h-7" />
                      </button>
                      <button 
                        onClick={() => handleSwipe('right')}
                        className="w-14 h-14 bg-white text-green-500 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center"
                      >
                        <Heart className="w-7 h-7" />
                      </button>
                      <button className="w-14 h-14 bg-white text-blue-500 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center">
                        <Star className="w-7 h-7 fill-current" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="text-6xl mb-4">💝</div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-2">Hiç kimse kalmadı!</h2>
                      <p className="text-gray-600 mb-6">Yeni insanları keşfetmek için biraz bekleyin</p>
                      <button 
                        onClick={() => setCurrentCardIndex(0)}
                        className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:from-pink-600 hover:to-purple-700 transition-all flex items-center space-x-2 mx-auto"
                      >
                        <RotateCcw className="w-5 h-5" />
                        <span>Tekrar Başla</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {currentView === 'messages' && (
              <div className="p-4">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Mesajlar</h2>
                
                {matches.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">💬</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Henüz mesajınız yok</h3>
                    <p className="text-gray-600">Eşleşme bulup sohbet etmeye başlayın!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {matches.map((user) => {
                      const chat = chats.find(c => c.userId === user.id);
                      return (
                        <div 
                          key={user.id}
                          onClick={() => {
                            setSelectedChatUser(user);
                            setCurrentView('chat');
                          }}
                          className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="relative">
                              <div className="w-12 h-12 text-2xl bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center">
                                {user.photos[0]}
                              </div>
                              {user.isOnline && (
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-1">
                                <p className="font-semibold text-gray-800">{user.name}</p>
                                {user.verified && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                              </div>
                              <p className="text-sm text-gray-500 truncate">
                                {chat?.lastMessage.text || user.lastMessage}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-400">now</p>
                              {!chat?.lastMessage.isRead && chat?.lastMessage.senderId !== currentUser.id && (
                                <div className="w-2 h-2 bg-pink-500 rounded-full ml-auto mt-1"></div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {currentView === 'likes' && (
              <div className="p-4">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Beğeniler</h2>
                
                {likedUsers.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">💖</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Henüz beğeni yok</h3>
                    <p className="text-gray-600">Keşfet sayfasında profilleri beğenmeye başlayın!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {likedUsers.map((user) => (
                      <div key={user.id} className="bg-white rounded-xl overflow-hidden shadow-sm">
                        <div className="aspect-square bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center">
                          <div className="text-4xl">{user.photos[0]}</div>
                        </div>
                        <div className="p-3">
                          <h3 className="font-semibold text-gray-800">{user.name}, {user.age}</h3>
                          <p className="text-xs text-gray-500">{user.location}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {currentView === 'profile' && (
              <div className="p-4">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
                    👤
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">{currentUser.name}</h2>
                  <p className="text-gray-600">{currentUser.email}</p>
                </div>

                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-4 border border-gray-100">
                    <h3 className="font-semibold text-gray-800 mb-2">Hesap Bilgileri</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>Yaş: {currentUser.age || 'Belirtilmemiş'}</p>
                      <p>Üyelik: Mart 2024</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 border border-gray-100">
                    <h3 className="font-semibold text-gray-800 mb-2">İstatistikler</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>Toplam beğeni: {likedUsers.length}</p>
                      <p>Eşleşme: {matches.length}</p>
                      <p>Mesaj: {chats.reduce((acc, chat) => acc + chat.messages.length, 0)}</p>
                    </div>
                  </div>

                  <button className="w-full bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors">
                    Çıkış Yap
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Bottom Navigation */}
          <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 px-4 py-2">
            <div className="flex justify-around">
              <button
                onClick={() => setCurrentView('discover')}
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                  currentView === 'discover' ? 'text-pink-600 bg-pink-50' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Heart className="w-6 h-6" />
                <span className="text-xs mt-1">Keşfet</span>
              </button>
              <button
                onClick={() => setCurrentView('messages')}
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors relative ${
                  currentView === 'messages' ? 'text-pink-600 bg-pink-50' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <MessageCircle className="w-6 h-6" />
                <span className="text-xs mt-1">Mesajlar</span>
                {matches.length > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
                    {matches.length}
                  </div>
                )}
              </button>
              <button
                onClick={() => setCurrentView('likes')}
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                  currentView === 'likes' ? 'text-pink-600 bg-pink-50' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Star className="w-6 h-6" />
                <span className="text-xs mt-1">Beğeniler</span>
              </button>
              <button
                onClick={() => setCurrentView('profile')}
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                  currentView === 'profile' ? 'text-pink-600 bg-pink-50' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <User className="w-6 h-6" />
                <span className="text-xs mt-1">Profil</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;