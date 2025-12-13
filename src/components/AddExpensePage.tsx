import { useState } from 'react';
import { Calendar, ChevronDown, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner@2.0.3';

interface AddExpensePageProps {
  onNavigate: (page: string) => void;
}

export function AddExpensePage({ onNavigate }: AddExpensePageProps) {
  const [activeTab, setActiveTab] = useState<'expense' | 'plan'>('expense');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showExitWarning, setShowExitWarning] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);

  // Expense form
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseDescription, setExpenseDescription] = useState('');
  const [expenseDate, setExpenseDate] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  // Plan form
  const [planTitle, setPlanTitle] = useState('');
  const [planAmount, setPlanAmount] = useState('');
  const [planDescription, setPlanDescription] = useState('');
  const [planDueDate, setPlanDueDate] = useState('');
  const [planCategory, setPlanCategory] = useState('');
  const [showPlanDatePicker, setShowPlanDatePicker] = useState(false);
  const [showPlanCategoryPicker, setShowPlanCategoryPicker] = useState(false);

  const categories = ['Jajan', 'Makan', 'Kebutuhan Kampus', 'Transport', 'Hiburan'];
  const [categorySearch, setCategorySearch] = useState('');
  const [showNewCategoryModal, setShowNewCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryBudget, setNewCategoryBudget] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#3b82f6');

  const filteredCategories = categories.filter(cat =>
    cat.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const handleNavigationAttempt = (page: string) => {
    if (hasUnsavedChanges) {
      setPendingNavigation(page);
      setShowExitWarning(true);
    } else {
      onNavigate(page);
    }
  };

  const handleConfirmExit = () => {
    setShowExitWarning(false);
    if (pendingNavigation) {
      onNavigate(pendingNavigation);
    }
  };

  const handleAddNewCategory = (categoryName: string) => {
    setNewCategoryName(categoryName);
    setShowCategoryPicker(false);
    setShowPlanCategoryPicker(false);
    setShowNewCategoryModal(true);
  };

  const handleSaveNewCategory = () => {
    if (!newCategoryName || !newCategoryBudget) {
      toast.error('Mohon isi nama dan budget kategori');
      return;
    }

    // Simulate adding category
    if (activeTab === 'expense') {
      setExpenseCategory(newCategoryName);
    } else {
      setPlanCategory(newCategoryName);
    }
    
    toast.success(`Kategori "${newCategoryName}" berhasil ditambahkan`);
    setShowNewCategoryModal(false);
    setNewCategoryName('');
    setNewCategoryBudget('');
    setNewCategoryColor('#3b82f6');
    setCategorySearch('');
  };

  const handleSaveExpense = () => {
    if (!expenseTitle || !expenseAmount || !expenseDate || !expenseCategory) {
      toast.error('Mohon isi semua field');
      return;
    }

    // Add to category or create new if doesn't exist
    setHasUnsavedChanges(false);
    toast.success('Pengeluaran berhasil ditambahkan');
    
    // Reset form
    setExpenseTitle('');
    setExpenseAmount('');
    setExpenseDescription('');
    setExpenseDate('');
    setExpenseCategory('');
  };

  const handleSavePlan = () => {
    if (!planTitle || !planAmount || !planDueDate || !planCategory) {
      toast.error('Mohon isi semua field');
      return;
    }

    setHasUnsavedChanges(false);
    toast.success('Rencana berhasil ditambahkan');
    
    // Reset form
    setPlanTitle('');
    setPlanAmount('');
    setPlanDescription('');
    setPlanDueDate('');
    setPlanCategory('');
  };

  const handleFormChange = () => {
    setHasUnsavedChanges(true);
  };

  const handleCategorySelect = (category: string) => {
    if (activeTab === 'expense') {
      setExpenseCategory(category);
    } else {
      setPlanCategory(category);
    }
    setCategorySearch('');
    setShowCategoryPicker(false);
    setShowPlanCategoryPicker(false);
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header with pattern */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 h-48 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }} />
        </div>
        
        <div className="relative px-6 pt-8 flex justify-center">
          {/* Tabs - Centered */}
          <div className="flex gap-2 bg-white/10 backdrop-blur-sm p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('expense')}
              className={`px-6 py-2 rounded-lg transition-colors ${
                activeTab === 'expense'
                  ? 'bg-yellow-400 text-blue-900'
                  : 'text-white'
              }`}
            >
              Tambah Pengeluaran
            </button>
            <button
              onClick={() => setActiveTab('plan')}
              className={`px-6 py-2 rounded-lg transition-colors ${
                activeTab === 'plan'
                  ? 'bg-yellow-400 text-blue-900'
                  : 'text-white'
              }`}
            >
              Rencana
            </button>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="px-6 -mt-16 relative z-10">
        {activeTab === 'expense' ? (
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4 max-w-3xl mx-auto">
            <div>
              <label className="block text-gray-700 mb-2">Judul Transaksi</label>
              <input
                type="text"
                value={expenseTitle}
                onChange={(e) => {
                  setExpenseTitle(e.target.value);
                  handleFormChange();
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Contoh: Makan siang"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Jumlah (Rp)</label>
              <input
                type="number"
                value={expenseAmount}
                onChange={(e) => {
                  setExpenseAmount(e.target.value);
                  handleFormChange();
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan jumlah"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Deskripsi</label>
              <textarea
                value={expenseDescription}
                onChange={(e) => {
                  setExpenseDescription(e.target.value);
                  handleFormChange();
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
                placeholder="Tambahkan deskripsi (opsional)"
              />
            </div>

            <div className="relative">
              <label className="block text-gray-700 mb-2">Tanggal</label>
              <div
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer flex items-center justify-between"
              >
                <span className={expenseDate ? 'text-gray-900' : 'text-gray-400'}>
                  {expenseDate ? new Date(expenseDate).toLocaleDateString('id-ID') : 'Pilih tanggal'}
                </span>
                <Calendar className="w-5 h-5 text-gray-400" />
              </div>
              
              <AnimatePresence>
                {showDatePicker && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full mt-2 w-full bg-white border border-gray-300 rounded-xl p-4 shadow-lg z-20"
                  >
                    <input
                      type="date"
                      value={expenseDate}
                      onChange={(e) => {
                        setExpenseDate(e.target.value);
                        setShowDatePicker(false);
                        handleFormChange();
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative">
              <label className="block text-gray-700 mb-2">Kategori</label>
              <div
                onClick={() => setShowCategoryPicker(!showCategoryPicker)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer flex items-center justify-between"
              >
                <span className={expenseCategory ? 'text-gray-900' : 'text-gray-400'}>
                  {expenseCategory || 'Pilih kategori'}
                </span>
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </div>
              
              <AnimatePresence>
                {showCategoryPicker && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full mt-2 w-full bg-white border border-gray-300 rounded-xl p-4 shadow-lg z-20 max-h-64 overflow-y-auto"
                  >
                    <input
                      type="text"
                      value={categorySearch}
                      onChange={(e) => setCategorySearch(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                      placeholder="Cari atau tambah kategori..."
                    />
                    
                    {categorySearch && !filteredCategories.some(cat => cat.toLowerCase() === categorySearch.toLowerCase()) && (
                      <button
                        onClick={() => handleAddNewCategory(categorySearch)}
                        className="w-full text-left px-4 py-2 hover:bg-blue-50 rounded-lg text-blue-600"
                      >
                        + Tambah "{categorySearch}"
                      </button>
                    )}
                    
                    {filteredCategories.map((category) => (
                      <button
                        key={category}
                        onClick={() => handleCategorySelect(category)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg"
                      >
                        {category}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={handleSaveExpense}
              className="w-full bg-yellow-400 text-blue-900 py-4 rounded-xl hover:bg-yellow-500 transition-colors"
            >
              Simpan
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4 max-w-3xl mx-auto">
            <div>
              <label className="block text-gray-700 mb-2">Judul Rencana</label>
              <input
                type="text"
                value={planTitle}
                onChange={(e) => {
                  setPlanTitle(e.target.value);
                  handleFormChange();
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Contoh: Bayar UKT"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Jumlah (Rp)</label>
              <input
                type="number"
                value={planAmount}
                onChange={(e) => {
                  setPlanAmount(e.target.value);
                  handleFormChange();
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan jumlah"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Deskripsi</label>
              <textarea
                value={planDescription}
                onChange={(e) => {
                  setPlanDescription(e.target.value);
                  handleFormChange();
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
                placeholder="Tambahkan deskripsi (opsional)"
              />
            </div>

            <div className="relative">
              <label className="block text-gray-700 mb-2">Tanggal Pembayaran</label>
              <div
                onClick={() => setShowPlanDatePicker(!showPlanDatePicker)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer flex items-center justify-between"
              >
                <span className={planDueDate ? 'text-gray-900' : 'text-gray-400'}>
                  {planDueDate ? new Date(planDueDate).toLocaleDateString('id-ID') : 'Pilih tanggal'}
                </span>
                <Calendar className="w-5 h-5 text-gray-400" />
              </div>
              
              <AnimatePresence>
                {showPlanDatePicker && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full mt-2 w-full bg-white border border-gray-300 rounded-xl p-4 shadow-lg z-20"
                  >
                    <input
                      type="date"
                      value={planDueDate}
                      onChange={(e) => {
                        setPlanDueDate(e.target.value);
                        setShowPlanDatePicker(false);
                        handleFormChange();
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative">
              <label className="block text-gray-700 mb-2">Kategori</label>
              <div
                onClick={() => setShowPlanCategoryPicker(!showPlanCategoryPicker)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer flex items-center justify-between"
              >
                <span className={planCategory ? 'text-gray-900' : 'text-gray-400'}>
                  {planCategory || 'Pilih kategori'}
                </span>
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </div>
              
              <AnimatePresence>
                {showPlanCategoryPicker && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full mt-2 w-full bg-white border border-gray-300 rounded-xl p-4 shadow-lg z-20 max-h-64 overflow-y-auto"
                  >
                    <input
                      type="text"
                      value={categorySearch}
                      onChange={(e) => setCategorySearch(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                      placeholder="Cari atau tambah kategori..."
                    />
                    
                    {categorySearch && !filteredCategories.some(cat => cat.toLowerCase() === categorySearch.toLowerCase()) && (
                      <button
                        onClick={() => handleAddNewCategory(categorySearch)}
                        className="w-full text-left px-4 py-2 hover:bg-blue-50 rounded-lg text-blue-600"
                      >
                        + Tambah "{categorySearch}"
                      </button>
                    )}
                    
                    {filteredCategories.map((category) => (
                      <button
                        key={category}
                        onClick={() => handleCategorySelect(category)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg"
                      >
                        {category}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={handleSavePlan}
              className="w-full bg-yellow-400 text-blue-900 py-4 rounded-xl hover:bg-yellow-500 transition-colors"
            >
              Simpan
            </button>
          </div>
        )}
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
              <p className="text-gray-600 mb-6">Apakah Anda yakin ingin keluar?</p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowExitWarning(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl hover:bg-gray-300 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirmExit}
                  className="flex-1 bg-yellow-400 text-blue-900 py-3 rounded-xl hover:bg-yellow-500 transition-colors"
                >
                  Ya, Keluar
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* New Category Modal */}
      <AnimatePresence>
        {showNewCategoryModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowNewCategoryModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 w-[90%] max-w-md z-50"
            >
              <h3 className="text-xl text-gray-800 mb-2">Tambah Kategori Baru</h3>
              <p className="text-gray-600 mb-6">Isi detail kategori baru di bawah ini:</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Nama Kategori</label>
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Contoh: Belanjaan"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Budget (Rp)</label>
                  <input
                    type="number"
                    value={newCategoryBudget}
                    onChange={(e) => setNewCategoryBudget(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan budget"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Warna</label>
                  <input
                    type="color"
                    value={newCategoryColor}
                    onChange={(e) => setNewCategoryColor(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowNewCategoryModal(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl hover:bg-gray-300 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveNewCategory}
                  className="flex-1 bg-yellow-400 text-blue-900 py-3 rounded-xl hover:bg-yellow-500 transition-colors"
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