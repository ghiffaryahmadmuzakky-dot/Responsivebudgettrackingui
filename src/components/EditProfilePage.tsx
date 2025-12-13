import { useState } from 'react';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner@2.0.3';

interface EditProfilePageProps {
  user: { username: string; fullName: string };
  onBack: () => void;
}

export function EditProfilePage({ user, onBack }: EditProfilePageProps) {
  const [fullName, setFullName] = useState(user.fullName);
  const [email, setEmail] = useState('admin@example.com');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showExitWarning, setShowExitWarning] = useState(false);

  const handleFormChange = () => {
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    if (!fullName || !email) {
      toast.error('Nama lengkap dan email wajib diisi');
      return;
    }

    if (!email.includes('@')) {
      toast.error('Email tidak valid');
      return;
    }

    setHasUnsavedChanges(false);
    toast.success('Perubahan berhasil disimpan');
    
    // Delay back navigation slightly so user sees the success message
    setTimeout(() => {
      onBack();
    }, 1000);
  };

  const handleBackClick = () => {
    if (hasUnsavedChanges) {
      setShowExitWarning(true);
    } else {
      onBack();
    }
  };

  const handleConfirmExit = () => {
    setShowExitWarning(false);
    onBack();
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header with pattern */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 px-6 py-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }} />
        </div>
        
        <div className="relative flex items-center gap-4">
          <button
            onClick={handleBackClick}
            className="bg-white/20 backdrop-blur-sm p-2 rounded-full"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-white text-xl">Edit Profil</h1>
        </div>
      </div>

      {/* Form */}
      <div className="px-6 py-8 space-y-6">
        <div>
          <label className="block text-gray-700 mb-2">Nama Lengkap</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              handleFormChange();
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900"
            placeholder="Masukkan nama lengkap"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              handleFormChange();
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900"
            placeholder="Masukkan email"
          />
        </div>

        {/* Save Button */}
        <div className="pt-4 flex justify-center">
          <button
            onClick={handleSave}
            className="bg-blue-900 text-white px-12 py-4 rounded-xl hover:bg-blue-800 transition-colors"
          >
            Simpan Perubahan
          </button>
        </div>
      </div>

      {/* Exit Warning Modal */}
      <AnimatePresence>
        {showExitWarning && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowExitWarning(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 w-[90%] max-w-md z-50"
            >
              <h3 className="text-xl text-gray-800 mb-2">Perubahan Belum Disimpan</h3>
              <p className="text-gray-600 mb-6">Apakah Anda yakin ingin keluar tanpa menyimpan perubahan?</p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowExitWarning(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl hover:bg-gray-300 transition-colors"
                >
                  Kembali
                </button>
                <button
                  onClick={handleConfirmExit}
                  className="flex-1 bg-yellow-500 text-blue-900 py-3 rounded-xl hover:bg-yellow-600 transition-colors"
                >
                  Simpan
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}