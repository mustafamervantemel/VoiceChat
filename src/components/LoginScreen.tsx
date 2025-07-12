import React, { useState } from 'react';
import { Heart, Mail, Lock, Eye, EyeOff, Apple } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  age?: number;
  bio?: string;
  photos?: string[];
}

interface LoginScreenProps {
  onLogin: (user: User) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    bio: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email.trim() || !formData.password.trim()) return;
    
    const user: User = {
      id: Date.now().toString(),
      name: formData.name || 'Demo User',
      email: formData.email,
      age: formData.age ? parseInt(formData.age) : 25,
      bio: formData.bio || 'Hello! I\'m excited to meet new people.',
      photos: ['👤']
    };
    
    onLogin(user);
  };

  const handleDemoLogin = () => {
    const demoUser: User = {
      id: 'demo-user',
      name: 'Demo User',
      email: 'demo@sugo.com',
      age: 25,
      bio: 'Demo kullanıcısı - SUGO\'yu keşfetmeye hazır!',
      photos: ['👤']
    };
    onLogin(demoUser);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-600 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 -right-20 w-96 h-96 rounded-full border-4 border-white/20"></div>
        <div className="absolute bottom-20 -left-20 w-96 h-96 rounded-full border-4 border-white/20"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border-2 border-white/10"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-lg rounded-full mb-4">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-white mb-2">SUGO</h1>
            <p className="text-blue-100">Find your perfect match</p>
          </div>

          {/* Login/Register Form */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/20">
            {/* Tab Switcher */}
            <div className="flex rounded-2xl bg-white/20 p-1 mb-6">
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  isLogin
                    ? 'bg-white text-blue-600 shadow-lg'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                Giriş Yap
              </button>
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  !isLogin
                    ? 'bg-white text-blue-600 shadow-lg'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                Kayıt Ol
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    İsim
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200"
                    placeholder="Adınızı girin"
                    required={!isLogin}
                  />
                </div>
              )}

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  E-posta
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-200" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200"
                    placeholder="E-posta adresinizi girin"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Şifre
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-200" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full pl-10 pr-12 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200"
                    placeholder="Şifrenizi girin"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-200 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <>
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Yaş
                    </label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData({...formData, age: e.target.value})}
                      className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200"
                      placeholder="Yaşınızı girin"
                      min="18"
                      max="100"
                    />
                  </div>
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Bio
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200 resize-none"
                      placeholder="Kendinizi tanıtın..."
                      rows={3}
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                className="w-full bg-white text-blue-600 py-3 px-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
              >
                {isLogin ? 'Giriş Yap' : 'Hesap Oluştur'} ❤️
              </button>
            </form>

            {/* Social Login */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/30"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-transparent text-blue-100">veya</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button className="w-full bg-black text-white py-3 px-4 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-200 flex items-center justify-center space-x-3">
                  <Apple className="w-5 h-5" />
                  <span>Apple ile Devam Et</span>
                </button>
                
                <button className="w-full bg-white text-gray-800 py-3 px-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 flex items-center justify-center space-x-3">
                  <div className="w-5 h-5 bg-gradient-to-br from-yellow-400 via-red-500 to-pink-500 rounded-sm flex items-center justify-center">
                    <span className="text-white text-xs font-bold">G</span>
                  </div>
                  <span>Google ile Devam Et</span>
                </button>

                <button 
                  onClick={handleDemoLogin}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center justify-center space-x-3"
                >
                  <span>🚀 Demo Hesabı ile Giriş</span>
                </button>
              </div>
            </div>

            {isLogin && (
              <div className="mt-4 text-center">
                <button className="text-blue-100 text-sm hover:text-white transition-colors">
                  Şifreni mi unuttun?
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-blue-100 text-sm mb-4">
              💝 500,000+ mutlu çift oluşturduk
            </p>
            <div className="flex justify-center space-x-6 text-blue-200 text-xs">
              <span>🔒 Güvenli</span>
              <span>❤️ Kaliteli Eşleşme</span>
              <span>🌍 Dünya Çapında</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;