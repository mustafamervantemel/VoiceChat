import React, { useState } from 'react';
import { Mic, Users, Globe } from 'lucide-react';
import { User } from '../types';

interface LoginScreenProps {
  onLogin: (user: User) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [isGuest, setIsGuest] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) return;
    
    const user: User = {
      id: Date.now().toString(),
      username: username.trim(),
      email: isGuest ? undefined : email,
      isGuest,
      joinedAt: new Date(),
    };
    
    onLogin(user);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <Mic className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">VoiceChat</h1>
          <p className="text-purple-100">Sesli sohbet platformu</p>
        </div>

        {/* Login Form */}
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
          <div className="flex rounded-lg bg-white bg-opacity-20 p-1 mb-6">
            <button
              type="button"
              onClick={() => setIsGuest(true)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                isGuest
                  ? 'bg-white text-purple-700 shadow-md'
                  : 'text-white hover:bg-white hover:bg-opacity-10'
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Misafir Girişi
            </button>
            <button
              type="button"
              onClick={() => setIsGuest(false)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                !isGuest
                  ? 'bg-white text-purple-700 shadow-md'
                  : 'text-white hover:bg-white hover:bg-opacity-10'
              }`}
            >
              <Globe className="w-4 h-4 inline mr-2" />
              Üye Girişi
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                {isGuest ? 'Kullanıcı Adı' : 'Kullanıcı Adı'}
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200"
                placeholder={isGuest ? 'Rumuzunuzu girin' : 'Kullanıcı adınızı girin'}
                required
              />
            </div>

            {!isGuest && (
              <>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    E-posta
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200"
                    placeholder="E-posta adresinizi girin"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Şifre
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200"
                    placeholder="Şifrenizi girin"
                    required
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full bg-white text-purple-700 py-3 px-4 rounded-lg font-semibold hover:bg-purple-50 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              {isGuest ? 'Misafir Olarak Giriş Yap' : 'Giriş Yap'}
            </button>
          </form>

          {!isGuest && (
            <div className="mt-4 text-center">
              <p className="text-purple-200 text-sm">
                Hesabınız yok mu?{' '}
                <button className="text-white underline hover:text-purple-100 transition-colors">
                  Kayıt Olun
                </button>
              </p>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="mt-8 text-center">
          <p className="text-purple-200 text-sm mb-4">
            ✨ Gerçek zamanlı sesli sohbet deneyimi
          </p>
          <div className="flex justify-center space-x-6 text-purple-300 text-xs">
            <span>🎤 HD Ses Kalitesi</span>
            <span>🌐 Tarayıcı Tabanlı</span>
            <span>📱 Mobil Uyumlu</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;