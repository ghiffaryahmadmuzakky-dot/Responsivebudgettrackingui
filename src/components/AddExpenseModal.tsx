import { useState } from 'react';
import { X, Calendar, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner@2.0.3';

interface AddExpenseModalProps {
  defaultCategory?: string;
  onClose: () => void;
  onSave: () => void;
}

export function AddExpenseModal({ defaultCategory, onClose, onSave }: AddExpenseModalProps) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState(defaultCategory || '');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  const categories = ['Jajan', 'Makan', 'Kebutuhan Kampus', 'Transport', 'Hiburan'];
  const [categorySearch, setCategorySearch] = useState('');

  const filteredCategories = categories.filter(cat =>
    cat.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const handleSave = () => {
    if (!title || !amount || !date || !category) {
      toast.error('Mohon isi semua field');
      return;
    }

    toast.success('Pengeluaran berhasil ditambahkan');
    onSave();
  };

  const handleCategorySelect = (cat: string) => {
    setCategory(cat);
    setCategorySearch('');
    setShowCategoryPicker(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 w-[90%] max-w-md z-50 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl text-gray-800">Tambah Pengeluaran</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Judul Transaksi</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Contoh: Makan siang"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Jumlah (Rp)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan jumlah"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Deskripsi</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
              placeholder="Tambahkan deskripsi (opsional)"
            />
          </div>

          <div className="relative">
            <label className="block text-gray-700 mb-2">Tanggal</label>
            <div
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl cursor-pointer flex items-center justify-between"
            >
              <span className={date ? 'text-gray-900' : 'text-gray-400'}>
                {date ? new Date(date).toLocaleDateString('id-ID') : 'Pilih tanggal'}
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
                    value={date}
                    onChange={(e) => {
                      setDate(e.target.value);
                      setShowDatePicker(false);
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
              className="w-full px-4 py-3 border border-gray-300 rounded-xl cursor-pointer flex items-center justify-between"
            >
              <span className={category ? 'text-gray-900' : 'text-gray-400'}>
                {category || 'Pilih kategori'}
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
                      onClick={() => handleCategorySelect(categorySearch)}
                      className="w-full text-left px-4 py-2 hover:bg-blue-50 rounded-lg text-blue-600"
                    >
                      + Tambah "{categorySearch}"
                    </button>
                  )}
                  
                  {filteredCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategorySelect(cat)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg"
                    >
                      {cat}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-yellow-400 text-blue-900 py-4 rounded-xl hover:bg-yellow-500 transition-colors"
          >
            Simpan
          </button>
        </div>
      </motion.div>
    </>
  );
}
