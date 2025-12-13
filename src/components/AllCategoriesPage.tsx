import { useState } from 'react';
import { ArrowLeft, Search, Plus, Edit2, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner@2.0.3';

interface Category {
  id: string;
  name: string;
  spent: number;
  budget: number;
  color: string;
}

interface AllCategoriesPageProps {
  categories: Category[];
  onBack: () => void;
  onUpdateCategories: (categories: Category[]) => void;
}

type SortBy = 'name-asc' | 'name-desc' | 'amount-asc' | 'amount-desc';

export function AllCategoriesPage({ categories, onBack, onUpdateCategories }: AllCategoriesPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('name-asc');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryBudget, setNewCategoryBudget] = useState('');

  const filteredCategories = categories
    .filter(cat => cat.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'amount-asc':
          return a.spent - b.spent;
        case 'amount-desc':
          return b.spent - a.spent;
        default:
          return 0;
      }
    });

  const handleAddCategory = () => {
    if (!newCategoryName || !newCategoryBudget) {
      toast.error('Mohon isi semua field');
      return;
    }

    const budget = parseFloat(newCategoryBudget);
    if (isNaN(budget) || budget <= 0) {
      toast.error('Budget tidak valid');
      return;
    }

    const colors = ['bg-pink-500', 'bg-orange-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-indigo-500'];
    const newCategory: Category = {
      id: Date.now().toString(),
      name: newCategoryName,
      spent: 0,
      budget: budget,
      color: colors[Math.floor(Math.random() * colors.length)]
    };

    onUpdateCategories([...categories, newCategory]);
    setNewCategoryName('');
    setNewCategoryBudget('');
    setShowAddModal(false);
    toast.success('Kategori berhasil ditambahkan');
  };

  const handleUpdateCategory = () => {
    if (!editingCategory || !newCategoryName || !newCategoryBudget) {
      toast.error('Mohon isi semua field');
      return;
    }

    const budget = parseFloat(newCategoryBudget);
    if (isNaN(budget) || budget <= 0) {
      toast.error('Budget tidak valid');
      return;
    }

    const updated = categories.map(cat =>
      cat.id === editingCategory.id
        ? { ...cat, name: newCategoryName, budget: budget }
        : cat
    );
    onUpdateCategories(updated);
    setEditingCategory(null);
    setNewCategoryName('');
    setNewCategoryBudget('');
    toast.success('Kategori berhasil diperbarui');
  };

  const handleDeleteCategory = (id: string) => {
    const updated = categories.filter(cat => cat.id !== id);
    onUpdateCategories(updated);
    toast.success('Kategori berhasil dihapus');
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setNewCategoryName(category.name);
    setNewCategoryBudget(category.budget.toString());
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
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
          <h1 className="text-white text-xl">Semua Kategori</h1>
        </div>
      </div>

      {/* Search and Sort */}
      <div className="px-6 py-4 space-y-4 bg-gray-50 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Cari kategori..."
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSortBy('name-asc')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              sortBy === 'name-asc' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            Nama A-Z
          </button>
          <button
            onClick={() => setSortBy('name-desc')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              sortBy === 'name-desc' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            Nama Z-A
          </button>
          <button
            onClick={() => setSortBy('amount-desc')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              sortBy === 'amount-desc' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            Terbanyak
          </button>
          <button
            onClick={() => setSortBy('amount-asc')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              sortBy === 'amount-asc' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            Tersedikit
          </button>
        </div>
      </div>

      {/* Categories List */}
      <div className="px-6 py-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-gray-800">Daftar Kategori</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-yellow-400 text-blue-900 px-4 py-2 rounded-lg hover:bg-yellow-500 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Tambah
          </button>
        </div>

        <div className="space-y-3">
          {filteredCategories.map((category) => {
            const percentage = (category.spent / category.budget) * 100;
            return (
              <div
                key={category.id}
                className="bg-white border border-gray-200 rounded-xl p-4"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-gray-800 mb-1">{category.name}</h3>
                    <p className="text-gray-600 text-sm">
                      Rp {category.spent.toLocaleString('id-ID')} / Rp {category.budget.toLocaleString('id-ID')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(category)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${category.color} h-2 rounded-full transition-all`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add/Edit Category Modal */}
      <AnimatePresence>
        {(showAddModal || editingCategory) && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => {
                setShowAddModal(false);
                setEditingCategory(null);
                setNewCategoryName('');
                setNewCategoryBudget('');
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 w-[90%] max-w-md z-50"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl text-gray-800">
                  {editingCategory ? 'Edit Kategori' : 'Tambah Kategori'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingCategory(null);
                    setNewCategoryName('');
                    setNewCategoryBudget('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Nama Kategori</label>
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan nama kategori"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Budget</label>
                  <input
                    type="number"
                    value={newCategoryBudget}
                    onChange={(e) => setNewCategoryBudget(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan budget"
                  />
                </div>

                <button
                  onClick={editingCategory ? handleUpdateCategory : handleAddCategory}
                  className="w-full bg-yellow-400 text-blue-900 py-3 rounded-xl hover:bg-yellow-500 transition-colors"
                >
                  {editingCategory ? 'Perbarui' : 'Tambah'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
