import { useState } from 'react';
import { ArrowLeft, Bell, CheckCircle } from 'lucide-react';

interface NotificationsPageProps {
  onBack: () => void;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  isRead: boolean;
}

export function NotificationsPage({ onBack }: NotificationsPageProps) {
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Pengeluaran Berhasil Ditambahkan',
      message: 'Pengeluaran "Makan Siang" sebesar Rp 25.000 berhasil ditambahkan',
      date: '2024-12-09 14:30',
      isRead: false
    },
    {
      id: '2',
      title: 'Saldo Bulanan Diperbarui',
      message: 'Saldo bulanan Anda telah diperbarui menjadi Rp 5.000.000',
      date: '2024-12-08 09:15',
      isRead: false
    },
    {
      id: '3',
      title: 'Rencana Pembayaran Selesai',
      message: 'Anda telah menyelesaikan rencana "Membayar UKT"',
      date: '2024-12-07 16:45',
      isRead: true
    },
    {
      id: '4',
      title: 'Peringatan Budget',
      message: 'Budget kategori "Jajan" sudah terpakai 80%',
      date: '2024-12-06 10:20',
      isRead: true
    },
    {
      id: '5',
      title: 'Kategori Baru Ditambahkan',
      message: 'Kategori "Transport" berhasil ditambahkan',
      date: '2024-12-05 13:00',
      isRead: true
    }
  ]);

  const filteredNotifications = showUnreadOnly
    ? notifications.filter(n => !n.isRead)
    : notifications;

  const handleNotificationClick = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
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
          <h1 className="text-white text-xl">Notifikasi</h1>
        </div>
      </div>

      {/* Filter Toggle */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={showUnreadOnly}
            onChange={(e) => setShowUnreadOnly(e.target.checked)}
            className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-gray-800">Tampilkan hanya yang belum dibaca</span>
        </label>
      </div>

      {/* Notifications List */}
      <div className="px-6 py-4">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Tidak ada notifikasi</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification.id)}
                className={`border rounded-xl p-4 cursor-pointer transition-all ${
                  notification.isRead
                    ? 'bg-white border-gray-200'
                    : 'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {notification.isRead ? (
                      <CheckCircle className="w-5 h-5 text-gray-400" />
                    ) : (
                      <div className="w-3 h-3 bg-blue-600 rounded-full" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className={`mb-1 ${notification.isRead ? 'text-gray-800' : 'text-blue-900'}`}>
                      {notification.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">{notification.message}</p>
                    <p className="text-gray-400 text-xs">{notification.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
