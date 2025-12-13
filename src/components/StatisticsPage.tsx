import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ChevronDown, X, TrendingUp, Hash, DollarSign, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function StatisticsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  const categories = [
    { name: 'Semua Kategori', total: 2300000 },
    { name: 'Makan', total: 1200000 },
    { name: 'Jajan', total: 450000 },
    { name: 'Kebutuhan Kampus', total: 300000 },
    { name: 'Transport', total: 200000 },
    { name: 'Hiburan', total: 150000 }
  ];

  // Data pengeluaran per hari dalam seminggu
  const weeklyData = [
    { day: 'Sen', amount: 85000 },
    { day: 'Sel', amount: 120000 },
    { day: 'Rab', amount: 95000 },
    { day: 'Kam', amount: 200000 },
    { day: 'Jum', amount: 150000 },
    { day: 'Sab', amount: 180000 },
    { day: 'Min', amount: 75000 }
  ];

  // Data kategori untuk pie chart (sorted by amount)
  const categoryData = [
    { name: 'Makan', value: 1200000, color: '#f97316' },
    { name: 'Jajan', value: 450000, color: '#ec4899' },
    { name: 'Kebutuhan Kampus', value: 300000, color: '#3b82f6' },
    { name: 'Transport', value: 200000, color: '#10b981' },
    { name: 'Hiburan', value: 150000, color: '#8b5cf6' }
  ].sort((a, b) => b.value - a.value);

  const totalSpent = categoryData.reduce((sum, item) => sum + item.value, 0);
  const totalTransactions = 47; // Mock data
  const totalCategories = categoryData.length;
  const averageExpense = totalSpent / totalTransactions;
  const highestDay = weeklyData.reduce((max, day) => day.amount > max.amount ? day : max, weeklyData[0]);
  
  const currentCategory = selectedCategory || 'Semua Kategori';

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
          <h1 className="text-white text-2xl">Analisis Keuangan</h1>
          <p className="text-white/80 mt-1">Statistik pengeluaran Anda</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="px-6 -mt-32 mb-6 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <label className="block text-gray-700 mb-2">Pilih Kategori</label>
          <div
            onClick={() => setShowCategoryPicker(!showCategoryPicker)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl cursor-pointer flex items-center justify-between bg-white"
          >
            <span className="text-gray-900">{currentCategory}</span>
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </div>
          
          <AnimatePresence>
            {showCategoryPicker && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute left-6 right-6 mt-2 bg-white border border-gray-300 rounded-xl shadow-lg z-20 max-h-64 overflow-y-auto"
              >
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => {
                      setSelectedCategory(category.name === 'Semua Kategori' ? null : category.name);
                      setShowCategoryPicker(false);
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-100 border-b border-gray-100 last:border-b-0 ${
                      currentCategory === category.name ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-gray-800">{category.name}</span>
                      <span className="text-gray-600">Rp {category.total.toLocaleString('id-ID')}</span>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Total Spending Card */}
      <div className="px-6 mb-6">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <p className="text-gray-600 mb-2">
            {selectedCategory ? `Total Pengeluaran ${selectedCategory}` : 'Total Pengeluaran Minggu Ini'}
          </p>
          <p className="text-3xl text-blue-900">Rp {totalSpent.toLocaleString('id-ID')}</p>
        </div>
      </div>

      {/* Weekly Expense Chart */}
      <div className="px-6 mb-8">
        <h2 className="text-gray-800 mb-4">Pengeluaran Per Hari (Minggu Ini)</h2>
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip formatter={(value: number) => `Rp ${value.toLocaleString('id-ID')}`} />
              <Legend />
              <Bar dataKey="amount" name="Pengeluaran" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          
          <div className="mt-4 p-4 bg-blue-50 rounded-xl">
            <p className="text-blue-900">
              Hari dengan pengeluaran terbanyak: <span className="font-semibold">{highestDay.day} (Rp {highestDay.amount.toLocaleString('id-ID')})</span>
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="px-6 mb-8">
        <h2 className="text-gray-800 mb-4">Ringkasan</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-blue-600" />
              <p className="text-gray-600 text-sm">Total Pengeluaran</p>
            </div>
            <p className="text-xl text-blue-900">Rp {totalSpent.toLocaleString('id-ID')}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Hash className="w-5 h-5 text-blue-600" />
              <p className="text-gray-600 text-sm">Jumlah Transaksi</p>
            </div>
            <p className="text-xl text-blue-900">{totalTransactions}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <p className="text-gray-600 text-sm">Total Kategori</p>
            </div>
            <p className="text-xl text-blue-900">{totalCategories}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <p className="text-gray-600 text-sm">Rata-rata Pengeluaran</p>
            </div>
            <p className="text-xl text-blue-900">Rp {Math.round(averageExpense).toLocaleString('id-ID')}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4 col-span-2">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <p className="text-gray-600 text-sm">Hari dengan Nominal Terbesar Minggu Ini</p>
            </div>
            <p className="text-xl text-blue-900">{highestDay.day} - Rp {highestDay.amount.toLocaleString('id-ID')}</p>
          </div>
        </div>
      </div>

      {/* Distribution and Categories Side by Side */}
      <div className="px-6 mb-8">
        <h2 className="text-gray-800 mb-4">Distribusi & Kategori Pengeluaran</h2>
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Pie Chart - Left Side */}
            <div>
              <h3 className="text-gray-700 mb-4">Distribusi Pengeluaran</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `Rp ${value.toLocaleString('id-ID')}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Categories List - Right Side */}
            <div>
              <h3 className="text-gray-700 mb-4">Kategori Berdasarkan Pengeluaran</h3>
              <div className="space-y-4">
                {categoryData.map((category, index) => {
                  const percentage = (category.value / totalSpent) * 100;
                  return (
                    <div key={category.name}>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-gray-700">#{index + 1}</span>
                          <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: category.color }}
                          />
                          <span className="text-gray-800">{category.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-800">Rp {category.value.toLocaleString('id-ID')}</p>
                          <p className="text-gray-500 text-sm">{percentage.toFixed(1)}%</p>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{ 
                            width: `${percentage}%`,
                            backgroundColor: category.color
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}