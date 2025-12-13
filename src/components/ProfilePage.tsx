import { useState } from 'react';
import { User, Bell, Lock, LogOut, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { EditProfilePage } from './EditProfilePage';
import { NotificationsPage } from './NotificationsPage';
import { ChangePasswordPage } from './ChangePasswordPage';

interface ProfilePageProps {
  user: { username: string; fullName: string };
  onLogout: () => void;
}

export function ProfilePage({ user, onLogout }: ProfilePageProps) {
  const [currentView, setCurrentView] = useState<'main' | 'edit' | 'notifications' | 'password'>('main');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  const handlePhotoSelect = () => {
    // Simulate photo selection
    setShowPhotoOptions(false);
    // In real app, this would open file picker
    console.log('Photo picker opened');
  };

  const handleLogoutConfirm = () => {
    setShowLogoutConfirm(false);
    onLogout();
  };

  if (currentView === 'edit') {
    return <EditProfilePage user={user} onBack={() => setCurrentView('main')} />;
  }

  if (currentView === 'notifications') {
    return <NotificationsPage onBack={() => setCurrentView('main')} />;
  }

  if (currentView === 'password') {
    return <ChangePasswordPage onBack={() => setCurrentView('main')} />;
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header with pattern */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 h-64 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }} />
        </div>
        
        <div className="relative px-6 pt-8">
          <h1 className="text-white text-2xl">Profil</h1>
        </div>
      </div>

      {/* Profile Photo & Name */}
      <div className="px-6 -mt-32 mb-8">
        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
              {profilePhoto ? (
                <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <img 
                  src="https://images.unsplash.com/photo-1529995049601-ef63465a463f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9maWxlJTIwcG9ydHJhaXQlMjBwZXJzb258ZW58MXx8fHwxNzY1MTQwNzY4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" 
                  alt="Profile" 
                  className="w-full h-full object-cover" 
                />
              )}
            </div>
            <button
              onClick={() => setShowPhotoOptions(true)}
              className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
            >
              <Camera className="w-5 h-5 text-white" />
            </button>
          </div>
          
          <h2 className="text-blue-900 text-2xl text-center mb-8">{user.fullName}</h2>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-6 space-y-3 mb-8">
        <button
          onClick={() => setCurrentView('edit')}
          className="w-full bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
        >
          <div className="bg-blue-100 p-3 rounded-lg">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <span className="text-gray-800 flex-1 text-left">Edit Profil</span>
        </button>

        <button
          onClick={() => setCurrentView('password')}
          className="w-full bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
        >
          <div className="bg-purple-100 p-3 rounded-lg">
            <Lock className="w-6 h-6 text-purple-600" />
          </div>
          <span className="text-gray-800 flex-1 text-left">Ganti Password</span>
        </button>
      </div>

      {/* Logout Button */}
      <div className="px-6">
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full bg-blue-600 text-white py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-blue-700 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Keluar</span>
        </button>
      </div>

      {/* App Info */}
      <div className="px-6 mt-8">
        <div className="text-center text-gray-400 text-sm">
          <p>Budget Mahasiswa</p>
          <p className="mt-1">Versi 1.0.0</p>
        </div>
      </div>

      {/* Photo Options Modal */}
      <AnimatePresence>
        {showPhotoOptions && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowPhotoOptions(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 w-[90%] max-w-md z-50"
            >
              <h3 className="text-xl text-gray-800 mb-6 text-center">Pilih Foto</h3>
              
              <div className="space-y-3">
                <button
                  onClick={handlePhotoSelect}
                  className="w-full bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Pilih dari Galeri
                </button>
                <button
                  onClick={() => setShowPhotoOptions(false)}
                  className="w-full bg-gray-200 text-gray-800 py-4 rounded-xl hover:bg-gray-300 transition-colors"
                >
                  Batal
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowLogoutConfirm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 w-[90%] max-w-md z-50"
            >
              <h3 className="text-xl text-gray-800 mb-6 text-center">Apakah Anda yakin ingin keluar?</h3>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl hover:bg-gray-300 transition-colors"
                >
                  Kembali
                </button>
                <button
                  onClick={handleLogoutConfirm}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Keluar
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}