import { useState } from 'react';
import { ArrowLeft, Plus } from 'lucide-react';
import { AddExpenseModal } from './AddExpenseModal';

interface Category {
  id: string;
  name: string;
  spent: number;
  budget: number;
  color: string;
}

interface Transaction {
  id: string;
  title: string;
  amount: number;
  date: string;
  description: string;
}

interface CategoryHistoryPageProps {
  category: Category;
  onBack: () => void;
}

export function CategoryHistoryPage({ category, onBack }: CategoryHistoryPageProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Mock transactions for this category
  const [transactions] = useState<Transaction[]>([
    {
      id: '1',
      title: 'Makan Siang',
      amount: 25000,
      date: '2024-12-09',
      description: 'Makan di kantin kampus'
    },
    {
      id: '2',
      title: 'Beli Snack',
      amount: 15000,
      date: '2024-12-08',
      description: 'Cemilan untuk belajar'
    },
    {
      id: '3',
      title: 'Kopi',
      amount: 20000,
      date: '2024-12-07',
      description: 'Kopi di cafe'
    }
  ]);

  const percentage = (category.spent / category.budget) * 100;

  return (
    <div className="min-h-screen bg-white">
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
          <h1 className="text-white text-xl">Histori {category.name}</h1>
        </div>
      </div>

      {/* Category Summary */}
      <div className="px-6 py-6 bg-gray-50 border-b border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-800">{category.name}</span>
          <span className="text-gray-600">
            Rp {category.spent.toLocaleString('id-ID')} / Rp {category.budget.toLocaleString('id-ID')}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`${category.color} h-3 rounded-full transition-all`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        <p className="text-gray-500 text-sm mt-2">{percentage.toFixed(1)}% terpakai</p>
      </div>

      {/* Transactions List */}
      <div className="px-6 py-6">
        <h2 className="text-gray-800 mb-4">Riwayat Transaksi</h2>
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="bg-white border border-gray-200 rounded-xl p-4"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-gray-800">{transaction.title}</h3>
                  <p className="text-gray-500 text-sm">{transaction.description}</p>
                </div>
                <p className="text-red-500">-Rp {transaction.amount.toLocaleString('id-ID')}</p>
              </div>
              <p className="text-gray-400 text-sm">{new Date(transaction.date).toLocaleDateString('id-ID')}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Add Button */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-24 right-6 bg-yellow-400 text-blue-900 p-4 rounded-full shadow-lg hover:bg-yellow-500 transition-colors z-30"
      >
        <Plus className="w-6 h-6" />
      </button>

      {showAddModal && (
        <AddExpenseModal
          defaultCategory={category.name}
          onClose={() => setShowAddModal(false)}
          onSave={() => {
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
}