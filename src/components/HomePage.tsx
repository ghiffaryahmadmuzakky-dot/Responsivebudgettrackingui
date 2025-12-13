import { useState, useEffect } from 'react';
import { Eye, EyeOff, ChevronDown, ChevronUp, CheckCircle, Circle, Plus, X, Bell, ArrowUpDown, Calendar, ChevronLeft, ChevronRight, Edit2, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner@2.0.3';
import { CategoryHistoryPage } from './CategoryHistoryPage';
import { AllCategoriesPage } from './AllCategoriesPage';
import { CompletedPlansPage } from './CompletedPlansPage';

interface HomePageProps {
  user: { username: string; fullName: string };
}

interface PaymentPlan {
  id: string;
  title: string;
  amount: number;
  description: string;
  category: string;
  dueDate: string;
  completed: boolean;
  completedDate?: string;
}

interface Category {
  id: string;
  name: string;
  spent: number;
  budget: number;
  color: string;
}

type SortType = 'date-asc' | 'date-desc' | 'name-asc' | 'name-desc' | 'amount-asc' | 'amount-desc';

export function HomePage({ user }: HomePageProps) {
  const [balance, setBalance] = useState(5000000);
  const [showBalance, setShowBalance] = useState(true);
  const [showEditBalance, setShowEditBalance] = useState(false);
  const [newBalance, setNewBalance] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<PaymentPlan | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showCompletedPlans, setShowCompletedPlans] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [sortType, setSortType] = useState<SortType>('date-asc');
  const [showCompletedSortMenu, setShowCompletedSortMenu] = useState(false);
  const [completedSortType, setCompletedSortType] = useState<SortType>('date-desc');
  const [currentPage, setCurrentPage] = useState(0);
  const [completedCurrentPage, setCompletedCurrentPage] = useState(0);
  const [editingPlan, setEditingPlan] = useState<PaymentPlan | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editDueDate, setEditDueDate] = useState('');
  const [editCategory, setEditCategory] = useState('');

  const [paymentPlans, setPaymentPlans] = useState<PaymentPlan[]>([
    {
      id: '1',
      title: 'Membayar UKT',
      amount: 4000000,
      description: 'Pembayaran UKT semester genap 2024',
      category: 'Kebutuhan Kampus',
      dueDate: '2024-02-15',
      completed: false
    },
    {
      id: '2',
      title: 'Membayar Jaket Angkatan',
      amount: 350000,
      description: 'Jaket angkatan 2023',
      category: 'Kebutuhan Kampus',
      dueDate: '2024-01-20',
      completed: false
    },
    {
      id: '3',
      title: 'Membayar Iuran Studi Tour',
      amount: 2500000,
      description: 'Studi tour ke Bali',
      category: 'Kebutuhan Kampus',
      dueDate: '2024-03-01',
      completed: false
    },
    {
      id: '4',
      title: 'Bayar Kos',
      amount: 1500000,
      description: 'Kos bulan Januari',
      category: 'Kebutuhan Kampus',
      dueDate: '2024-03-15',
      completed: true,
      completedDate: '2024-01-05'
    },
    {
      id: '5',
      title: 'Bayar Kos Februari',
      amount: 1500000,
      description: 'Kos bulan Februari',
      category: 'Kebutuhan Kampus',
      dueDate: '2024-04-01',
      completed: false
    },
    {
      id: '6',
      title: 'Beli Buku Kuliah',
      amount: 200000,
      description: 'Buku untuk semester baru',
      category: 'Kebutuhan Kampus',
      dueDate: '2024-04-15',
      completed: false
    },
    {
      id: '7',
      title: 'Bayar Internet',
      amount: 300000,
      description: 'Internet bulanan',
      category: 'Kebutuhan Kampus',
      dueDate: '2024-05-01',
      completed: false
    }
  ]);

  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: 'Jajan', spent: 450000, budget: 800000, color: 'bg-pink-500' },
    { id: '2', name: 'Makan', spent: 1200000, budget: 1500000, color: 'bg-orange-500' },
    { id: '3', name: 'Kebutuhan Kampus', spent: 300000, budget: 1000000, color: 'bg-blue-500' },
    { id: '4', name: 'Transport', spent: 200000, budget: 500000, color: 'bg-green-500' },
    { id: '5', name: 'Hiburan', spent: 150000, budget: 400000, color: 'bg-purple-500' }
  ]);

  const handleSaveBalance = () => {
    const amount = parseFloat(newBalance);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Jumlah saldo tidak valid');
      return;
    }
    setBalance(amount);
    setNewBalance('');
    setShowEditBalance(false);
    toast.success('Saldo berhasil diubah');
  };

  const togglePlanComplete = (id: string) => {
    setPaymentPlans(plans => 
      plans.map(plan =>
        plan.id === id 
          ? { 
              ...plan, 
              completed: !plan.completed,
              completedDate: !plan.completed ? new Date().toISOString() : undefined
            } 
          : plan
      )
    );
  };

  const getSortedPlans = (plans: PaymentPlan[]) => {
    return [...plans].sort((a, b) => {
      switch (sortType) {
        case 'date-asc':
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'date-desc':
          return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
        case 'name-asc':
          return a.title.localeCompare(b.title);
        case 'name-desc':
          return b.title.localeCompare(a.title);
        case 'amount-asc':
          return a.amount - b.amount;
        case 'amount-desc':
          return b.amount - a.amount;
        default:
          return 0;
      }
    });
  };

  const groupPlansByMonth = (plans: PaymentPlan[]) => {
    const groups: { [key: string]: PaymentPlan[] } = {};
    plans.forEach(plan => {
      const date = new Date(plan.dueDate);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!groups[monthYear]) {
        groups[monthYear] = [];
      }
      groups[monthYear].push(plan);
    });
    return groups;
  };

  const incompletePlans = paymentPlans.filter(p => !p.completed);
  const completedPlans = paymentPlans.filter(p => p.completed);
  const sortedIncompletePlans = getSortedPlans(incompletePlans);
  const groupedPlans = groupPlansByMonth(sortedIncompletePlans);

  // Reset page if current page is invalid after plans change
  useEffect(() => {
    const monthKeys = Object.keys(groupedPlans).sort();
    const ITEMS_PER_PAGE = 3;
    const totalPages = Math.ceil(monthKeys.length / ITEMS_PER_PAGE);
    
    // If current page is greater than or equal to total pages, reset to last valid page
    if (currentPage >= totalPages && totalPages > 0) {
      setCurrentPage(totalPages - 1);
    } else if (totalPages === 0 && currentPage !== 0) {
      setCurrentPage(0);
    }
  }, [groupedPlans, currentPage]);

  const handleSortSelect = (type: SortType) => {
    setSortType(type);
    setShowSortMenu(false);
  };

  const handleCompletedSortSelect = (type: SortType) => {
    setCompletedSortType(type);
    setShowCompletedSortMenu(false);
  };

  const handleEditPlan = (plan: PaymentPlan) => {
    setEditingPlan(plan);
    setEditTitle(plan.title);
    setEditAmount(plan.amount.toString());
    setEditDescription(plan.description);
    setEditDueDate(plan.dueDate);
    setEditCategory(plan.category);
  };

  const handleSaveEdit = () => {
    if (!editTitle || !editAmount || !editDueDate || !editCategory) {
      toast.error('Mohon isi semua field');
      return;
    }

    setPaymentPlans(plans =>
      plans.map(plan =>
        plan.id === editingPlan?.id
          ? {
              ...plan,
              title: editTitle,
              amount: parseFloat(editAmount),
              description: editDescription,
              dueDate: editDueDate,
              category: editCategory
            }
          : plan
      )
    );

    toast.success('Rencana berhasil diubah');
    setEditingPlan(null);
    setEditTitle('');
    setEditAmount('');
    setEditDescription('');
    setEditDueDate('');
    setEditCategory('');
  };

  const handleUndoComplete = (id: string) => {
    togglePlanComplete(id);
    toast.success('Rencana dikembalikan ke daftar belum terbayar');
  };

  if (selectedCategory) {
    return (
      <CategoryHistoryPage
        category={selectedCategory}
        onBack={() => setSelectedCategory(null)}
      />
    );
  }

  if (showAllCategories) {
    return (
      <AllCategoriesPage
        categories={categories}
        onBack={() => setShowAllCategories(false)}
        onUpdateCategories={setCategories}
      />
    );
  }

  if (showCompletedPlans) {
    return (
      <CompletedPlansPage
        plans={completedPlans}
        allPlans={paymentPlans}
        onBack={() => setShowCompletedPlans(false)}
        onUpdatePlans={setPaymentPlans}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header with pattern - Behind the balance card */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 h-64 md:h-72 relative overflow-hidden pb-24">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }} />
        </div>
        
        <div className="relative px-6 pt-8 flex justify-between items-start z-10">
          <h1 className="text-white text-2xl">Halo, {user.fullName}!</h1>
          <button className="bg-white/20 backdrop-blur-sm p-2 rounded-full">
            <Bell className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* Balance Card - Overlapping the blue background */}
      <div className="px-6 -mt-32 mb-6 relative z-20">
        <div className="bg-white rounded-2xl shadow-lg p-6 max-w-2xl mx-auto">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <p className="text-gray-600 mb-2">Saldo Bulanan</p>
              <p className="text-3xl text-blue-900">
                {showBalance ? `Rp ${balance.toLocaleString('id-ID')}` : 'Rp ••••••'}
              </p>
            </div>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition-colors"
            >
              {showBalance ? <Eye className="w-5 h-5 text-gray-600" /> : <EyeOff className="w-5 h-5 text-gray-600" />}
            </button>
          </div>

          <button
            onClick={() => setShowEditBalance(!showEditBalance)}
            className="w-full flex items-center justify-center gap-2 bg-blue-400 text-white py-3 rounded-xl hover:bg-blue-500 transition-colors"
          >
            <span>Ubah Saldo</span>
            {showEditBalance ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          <AnimatePresence>
            {showEditBalance && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-blue-900 rounded-xl p-4 mt-4 space-y-4">
                  <div className="bg-white rounded-lg p-3">
                    <label className="block text-gray-700 mb-2">Jumlah Saldo Baru</label>
                    <input
                      type="number"
                      value={newBalance}
                      onChange={(e) => setNewBalance(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      placeholder="Masukkan jumlah saldo"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setShowEditBalance(false);
                        setNewBalance('');
                      }}
                      className="flex-1 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleSaveBalance}
                      className="flex-1 bg-yellow-500 text-blue-900 py-3 rounded-lg hover:bg-yellow-600 transition-colors"
                    >
                      Simpan
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Payment Plans */}
      <div className="px-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-gray-800">Rencana Pengeluaran</h2>
            <div className="relative">
              <button
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="p-1 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowUpDown className="w-5 h-5" />
              </button>
              
              <AnimatePresence>
                {showSortMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-30 min-w-[200px]"
                  >
                    <button
                      onClick={() => handleSortSelect('date-asc')}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100"
                    >
                      Tanggal Terdekat
                    </button>
                    <button
                      onClick={() => handleSortSelect('date-desc')}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100"
                    >
                      Tanggal Terjauh
                    </button>
                    <div className="border-t-2 border-gray-300 my-1" />
                    <button
                      onClick={() => handleSortSelect('name-asc')}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100"
                    >
                      Nama A-Z
                    </button>
                    <button
                      onClick={() => handleSortSelect('name-desc')}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100"
                    >
                      Nama Z-A
                    </button>
                    <div className="border-t-2 border-gray-300 my-1" />
                    <button
                      onClick={() => handleSortSelect('amount-asc')}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100"
                    >
                      Nominal Terendah
                    </button>
                    <button
                      onClick={() => handleSortSelect('amount-desc')}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-b-xl"
                    >
                      Nominal Tertinggi
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <button
            onClick={() => setShowCompletedPlans(true)}
            className="text-blue-900 hover:text-blue-800 transition-colors flex items-center gap-1"
          >
            <span className="text-sm">Sudah Terbayar</span>
          </button>
        </div>

        {incompletePlans.length === 0 ? (
          <div className="text-center py-12 bg-blue-50 rounded-2xl">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-blue-300">Belum Ada Perencanaan Anggaran</p>
            <p className="text-blue-300">Untuk Bulan Ini</p>
          </div>
        ) : (() => {
          const monthKeys = Object.keys(groupedPlans).sort();
          const ITEMS_PER_PAGE = 3;
          const totalPages = Math.ceil(monthKeys.length / ITEMS_PER_PAGE);
          const startIndex = currentPage * ITEMS_PER_PAGE;
          const endIndex = startIndex + ITEMS_PER_PAGE;
          const paginatedMonths = monthKeys.slice(startIndex, endIndex);

          return (
            <>
              <div>
                {paginatedMonths.map((monthYear, index) => (
                  <div key={monthYear}>
                    <div className="text-sm text-gray-500 mb-3 flex items-center gap-2 px-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(monthYear + '-01').toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })}
                    </div>
                    <div className="flex gap-4 overflow-x-scroll pb-4 mb-4 scrollbar-hide snap-x snap-mandatory scroll-smooth">
                      {groupedPlans[monthYear].map((plan) => (
                        <div
                          key={plan.id}
                          onClick={() => setSelectedPlan(plan)}
                          className="min-w-[280px] flex-shrink-0 rounded-xl p-4 cursor-pointer transition-all bg-yellow-100 hover:shadow-md snap-start"
                        >
                          <div className="flex items-start gap-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                togglePlanComplete(plan.id);
                              }}
                              className="mt-1"
                            >
                              <Circle className="w-6 h-6 text-gray-400" />
                            </button>
                            <div className="flex-1">
                              <h3 className="text-gray-800 mb-2">{plan.title}</h3>
                              <p className="text-blue-900">Rp {plan.amount.toLocaleString('id-ID')}</p>
                              <p className="text-gray-500 text-sm mt-1">
                                Jatuh tempo: {new Date(plan.dueDate).toLocaleDateString('id-ID')}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Horizontal separator between months */}
                    {index < paginatedMonths.length - 1 && (
                      <div className="border-t-2 border-gray-300 my-4" />
                    )}
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  <button
                    onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                    disabled={currentPage === 0}
                    className="p-2 rounded-lg bg-white border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index)}
                      className={`w-10 h-10 rounded-lg transition-colors ${
                        currentPage === index
                          ? 'bg-blue-900 text-white'
                          : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                    disabled={currentPage === totalPages - 1}
                    className="p-2 rounded-lg bg-white border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              )}
            </>
          );
        })()}
      </div>

      {/* Categories */}
      <div className="px-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-gray-800">Kategori Pengeluaran</h2>
          <button
            onClick={() => setShowAllCategories(true)}
            className="text-blue-900 hover:text-blue-800 transition-colors flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah</span>
          </button>
        </div>
        <div className="space-y-4">
          {categories.slice(0, 3).map((category) => {
            const percentage = (category.spent / category.budget) * 100;
            return (
              <div
                key={category.id}
                onClick={() => setSelectedCategory(category)}
                className="bg-white border border-gray-200 rounded-xl p-4 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-800">{category.name}</span>
                  <span className="text-gray-600">
                    Rp {category.spent.toLocaleString('id-ID')} / Rp {category.budget.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Plan Detail Modal */}
      <AnimatePresence>
        {selectedPlan && !showCompletedPlans && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setSelectedPlan(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 w-[90%] max-w-md z-50"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl text-gray-800">{selectedPlan.title}</h3>
                <button
                  onClick={() => setSelectedPlan(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-gray-500 text-sm">Jumlah</p>
                  <p className="text-blue-900 text-xl">Rp {selectedPlan.amount.toLocaleString('id-ID')}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Kategori</p>
                  <p className="text-gray-800">{selectedPlan.category}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Tanggal Jatuh Tempo</p>
                  <p className="text-gray-800">{new Date(selectedPlan.dueDate).toLocaleDateString('id-ID')}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Deskripsi</p>
                  <p className="text-gray-800">{selectedPlan.description}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedPlan(null)}
                className="w-full mt-6 bg-blue-900 text-white py-3 rounded-xl hover:bg-blue-800 transition-colors"
              >
                Tutup
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}