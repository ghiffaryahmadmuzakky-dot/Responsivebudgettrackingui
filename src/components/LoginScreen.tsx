import { useState } from 'react';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface LoginScreenProps {
  onLogin: (username: string, password: string) => boolean;
  onBack: () => void;
  onGoToRegister: () => void;
}

export function LoginScreen({ onLogin, onBack, onGoToRegister }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error('Mohon isi semua field');
      return;
    }

    const success = onLogin(username, password);
    if (!success) {
      toast.error('Username atau password salah');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header with pattern */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 h-48 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }} />
        </div>
        
        <button
          onClick={onBack}
          className="absolute top-6 left-6 bg-white/20 backdrop-blur-sm p-2 rounded-full"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        
        <div className="absolute bottom-8 left-8">
          <h1 className="text-white text-3xl">Masuk</h1>
          <p className="text-white/80 mt-1">Selamat datang kembali!</p>
        </div>
      </div>

      {/* Form */}
      <div className="px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900"
              placeholder="Masukkan username"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900 pr-12"
                placeholder="Masukkan password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-500 text-blue-900 py-4 rounded-xl hover:bg-yellow-600 transition-colors"
          >
            Masuk
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Belum punya akun?{' '}
            <button
              onClick={onGoToRegister}
              className="text-blue-900 hover:underline"
            >
              Daftar di sini
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}