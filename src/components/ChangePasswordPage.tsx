import { useState } from 'react';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ChangePasswordPageProps {
  onBack: () => void;
}

export function ChangePasswordPage({ onBack }: ChangePasswordPageProps) {
  const [step, setStep] = useState<'verify' | 'change'>('verify');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleVerifyPassword = () => {
    // In real app, this would verify against actual stored password
    if (currentPassword === 'admin123') {
      setStep('change');
      setCurrentPassword('');
    } else {
      toast.error('Sandi salah');
    }
  };

  const handleChangePassword = () => {
    if (!newPassword || !confirmPassword) {
      toast.error('Mohon isi semua field');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password minimal 6 karakter');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Password tidak cocok');
      return;
    }

    toast.success('Sandi telah diganti');
    
    // Reset and go back
    setTimeout(() => {
      setStep('verify');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      onBack();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header with pattern */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 px-6 py-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }} />
        </div>
        
        <div className="relative flex items-center gap-4">
          <button
            onClick={onBack}
            className="bg-white/20 backdrop-blur-sm p-2 rounded-full"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-white text-xl">Ganti Password</h1>
        </div>
      </div>

      {/* Form */}
      <div className="px-6 py-8">
        {step === 'verify' ? (
          <div className="space-y-6">
            <div>
              <p className="text-gray-600 mb-6 text-center">
                Masukkan password saat ini untuk melanjutkan
              </p>
              
              <label className="block text-gray-700 mb-2">Password Saat Ini</label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
                  placeholder="Masukkan password saat ini"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              onClick={handleVerifyPassword}
              className="w-full bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700 transition-colors"
            >
              Lanjutkan
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <p className="text-gray-600 mb-6 text-center">
                Masukkan password baru Anda
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Password Baru</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
                      placeholder="Masukkan password baru"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Konfirmasi Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
                      placeholder="Masukkan ulang password baru"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleChangePassword}
              className="w-full bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700 transition-colors"
            >
              Simpan
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
