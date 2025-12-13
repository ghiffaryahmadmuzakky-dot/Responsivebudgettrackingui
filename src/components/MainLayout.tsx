import { useState } from 'react';
import { Home, PlusCircle, BarChart3, User } from 'lucide-react';
import { HomePage } from './HomePage';
import { AddExpensePage } from './AddExpensePage';
import { StatisticsPage } from './StatisticsPage';
import { ProfilePage } from './ProfilePage';

type Page = 'home' | 'add' | 'statistics' | 'profile';

interface MainLayoutProps {
  user: { username: string; fullName: string };
  onLogout: () => void;
}

export function MainLayout({ user, onLogout }: MainLayoutProps) {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Page Content */}
      {currentPage === 'home' && <HomePage user={user} />}
      {currentPage === 'add' && <AddExpensePage onNavigate={setCurrentPage} />}
      {currentPage === 'statistics' && <StatisticsPage />}
      {currentPage === 'profile' && <ProfilePage user={user} onLogout={onLogout} />}

      {/* Bottom Navigation - Fixed */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 md:px-8 z-30">
        <div className="max-w-lg mx-auto flex justify-around items-center">
          <button
            onClick={() => setCurrentPage('home')}
            className={`flex flex-col items-center gap-1 transition-colors ${
              currentPage === 'home' ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs">Beranda</span>
          </button>

          <button
            onClick={() => setCurrentPage('add')}
            className={`flex flex-col items-center gap-1 transition-colors ${
              currentPage === 'add' ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            <PlusCircle className="w-6 h-6" />
            <span className="text-xs">Tambah</span>
          </button>

          <button
            onClick={() => setCurrentPage('statistics')}
            className={`flex flex-col items-center gap-1 transition-colors ${
              currentPage === 'statistics' ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            <BarChart3 className="w-6 h-6" />
            <span className="text-xs">Statistika</span>
          </button>

          <button
            onClick={() => setCurrentPage('profile')}
            className={`flex flex-col items-center gap-1 transition-colors ${
              currentPage === 'profile' ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            <User className="w-6 h-6" />
            <span className="text-xs">Profil</span>
          </button>
        </div>
      </nav>
    </div>
  );
}