import { useState, useEffect } from "react";
import { X, ArrowUpDown, Edit2, RotateCcw, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner"; // Perbaiki import jika perlu

const API_BASE_URL = "http://localhost:8080/api";

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

type SortType = "date-asc" | "date-desc" | "name-asc" | "name-desc" | "amount-asc" | "amount-desc";

interface CompletedPlansPageProps {
  plans: PaymentPlan[];
  allPlans: PaymentPlan[];
  onBack: () => void;
  onUpdatePlans: (plans: PaymentPlan[]) => void;
}

export function CompletedPlansPage({ plans, allPlans, onBack, onUpdatePlans }: CompletedPlansPageProps) {
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [sortType, setSortType] = useState<SortType>("date-desc");
  const [currentPage, setCurrentPage] = useState(0);
  
  // Edit State
  const [editingPlan, setEditingPlan] = useState<PaymentPlan | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const [editCategory, setEditCategory] = useState("");

  const ITEMS_PER_PAGE = 3;

  // --- LOGIC API: EDIT PLAN (PUT) ---
  const handleSaveEdit = async () => {
    if (!editTitle || !editAmount || !editDueDate || !editCategory) {
      toast.error("Mohon isi semua field");
      return;
    }

    if (!editingPlan) return;

    try {
      const payload = {
        title: editTitle,
        amount: parseFloat(editAmount),
        description: editDescription,
        dueDate: editDueDate,
        category: editCategory,
      };

      const response = await fetch(`${API_BASE_URL}/plans/${editingPlan.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("Gagal update data");

      // Update State Lokal
      const updatedAllPlans = allPlans.map((plan) =>
        plan.id === editingPlan.id ? { ...plan, ...payload } : plan
      );

      onUpdatePlans(updatedAllPlans);
      toast.success("Rencana berhasil diubah");
      setEditingPlan(null);
      // Reset Form
      setEditTitle(""); setEditAmount(""); setEditDescription(""); setEditDueDate(""); setEditCategory("");

    } catch (error) {
      console.error(error);
      toast.error("Gagal menyimpan perubahan ke server");
    }
  };

  // --- LOGIC API: UNDO COMPLETE (PATCH) ---
  const handleUndoComplete = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/plans/${id}/toggle`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: false }) // Kirim status false
      });

      if (!response.ok) throw new Error("Gagal undo");

      const updatedAllPlans = allPlans.map((plan) =>
        plan.id === id
          ? { ...plan, completed: false, completedDate: undefined }
          : plan
      );
      
      onUpdatePlans(updatedAllPlans);
      toast.success("Rencana dikembalikan ke daftar belum terbayar");

    } catch (error) {
      toast.error("Gagal menghubungi server");
    }
  };

  // --- HELPER FUNCTIONS (Sama seperti sebelumnya) ---
  const getSortedPlans = (plans: PaymentPlan[]) => {
    return [...plans].sort((a, b) => {
      switch (sortType) {
        case "date-asc": return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case "date-desc": return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
        case "name-asc": return a.title.localeCompare(b.title);
        case "name-desc": return b.title.localeCompare(a.title);
        case "amount-asc": return a.amount - b.amount;
        case "amount-desc": return b.amount - a.amount;
        default: return 0;
      }
    });
  };

  const handleSortSelect = (type: SortType) => {
    setSortType(type);
    setShowSortMenu(false);
  };

  const handleEditPlan = (plan: PaymentPlan) => {
    setEditingPlan(plan);
    setEditTitle(plan.title);
    setEditAmount(plan.amount.toString());
    setEditDescription(plan.description);
    setEditDueDate(plan.dueDate);
    setEditCategory(plan.category);
  };

  const groupPlansByMonth = (plans: PaymentPlan[]) => {
    const groups: { [key: string]: PaymentPlan[] } = {};
    plans.forEach((plan) => {
      const date = new Date(plan.dueDate);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      if (!groups[monthYear]) groups[monthYear] = [];
      groups[monthYear].push(plan);
    });
    return groups;
  };

  const sortedPlans = getSortedPlans(plans);
  const groupedPlans = groupPlansByMonth(sortedPlans);
  const monthKeys = Object.keys(groupedPlans).sort();

  useEffect(() => {
    const totalPages = Math.ceil(monthKeys.length / ITEMS_PER_PAGE);
    if (currentPage >= totalPages && totalPages > 0) {
      setCurrentPage(totalPages - 1);
    } else if (totalPages === 0 && currentPage !== 0) {
      setCurrentPage(0);
    }
  }, [groupedPlans, currentPage, monthKeys.length]);

  const totalPages = Math.ceil(monthKeys.length / ITEMS_PER_PAGE);
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const paginatedMonths = monthKeys.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // --- RENDER (Tidak berubah banyak, gunakan logic state di atas) ---
  return (
    <div className="min-h-screen bg-white pb-20">
      {/* HEADER & SORTING SAMA SEPERTI FILE ASLI */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 px-6 py-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
        </div>
        <div className="relative flex items-center gap-4">
          <button onClick={onBack} className="bg-white/20 backdrop-blur-sm p-2 rounded-full">
            <X className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-white text-xl">Rencana Terbayar</h1>
        </div>
      </div>

      <div className="px-6 py-4">
        <div className="flex items-center justify-end">
          <div className="relative">
            <button onClick={() => setShowSortMenu(!showSortMenu)} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-800 hover:bg-gray-50 transition-colors">
              <ArrowUpDown className="w-5 h-5" /> <span>Urutkan</span>
            </button>
            <AnimatePresence>
              {showSortMenu && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-30 min-w-[200px]">
                  <button onClick={() => handleSortSelect("date-asc")} className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 text-gray-800">Tanggal Terdekat</button>
                  <button onClick={() => handleSortSelect("date-desc")} className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 text-gray-800">Tanggal Terjauh</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* LIST ITEM - BAGIAN TOMBOL EDIT & UNDO */}
      <div className="px-6">
        {sortedPlans.length === 0 ? (
          <div className="text-center py-12"><p className="text-gray-400">Belum ada rencana yang terbayar</p></div>
        ) : (
          <div>
              {paginatedMonths.map((monthYear, monthIndex) => (
                <div key={monthYear}>
                  <div className="text-sm text-gray-500 mb-3 flex items-center gap-2 px-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(monthYear + "-01").toLocaleDateString("id-ID", { year: "numeric", month: "long" })}
                  </div>
                  <div className="space-y-3 mb-4">
                    {groupedPlans[monthYear].map((plan) => (
                      <div key={plan.id} className="bg-gray-100 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <h3 className="text-gray-600 line-through mb-1">{plan.title}</h3>
                            <p className="text-gray-500">Rp {plan.amount.toLocaleString("id-ID")}</p>
                            {plan.completedDate && (
                              <p className="text-gray-400 text-sm mt-1">Dibayar: {new Date(plan.completedDate).toLocaleDateString("id-ID")}</p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => handleEditPlan(plan)} className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
                              <Edit2 className="w-5 h-5" />
                            </button>
                            {/* TOMBOL UNDO MEMANGGIL FUNGSI ASYNC */}
                            <button onClick={() => handleUndoComplete(plan.id)} className="p-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 transition-colors">
                              <RotateCcw className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {monthIndex < paginatedMonths.length - 1 && <div className="border-t-2 border-gray-300 my-4" />}
                </div>
              ))}
              
              {/* Pagination Controls Here (Sama seperti file asli) */}
              {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-6">
                    <button onClick={() => setCurrentPage(Math.max(0, currentPage - 1))} disabled={currentPage === 0} className="p-2 rounded-lg bg-white border border-gray-200 disabled:opacity-50">
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    {/* ... page numbers ... */}
                    <button onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))} disabled={currentPage === totalPages - 1} className="p-2 rounded-lg bg-white border border-gray-200 disabled:opacity-50">
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
              )}
          </div>
        )}
      </div>

      {/* MODAL EDIT - TOMBOL SIMPAN MEMANGGIL ASYNC */}
      <AnimatePresence>
        {editingPlan && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-40" onClick={() => setEditingPlan(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 w-[90%] max-w-md z-50 max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl text-gray-800 mb-4">Edit Rencana</h3>
              <div className="space-y-4">
                <div><label className="block text-gray-700 mb-2">Judul</label><input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl" /></div>
                <div><label className="block text-gray-700 mb-2">Jumlah (Rp)</label><input type="number" value={editAmount} onChange={(e) => setEditAmount(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl" /></div>
                <div><label className="block text-gray-700 mb-2">Deskripsi</label><textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl resize-none" rows={3} /></div>
                <div><label className="block text-gray-700 mb-2">Tanggal Jatuh Tempo</label><input type="date" value={editDueDate} onChange={(e) => setEditDueDate(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl" /></div>
                <div><label className="block text-gray-700 mb-2">Kategori</label><input type="text" value={editCategory} onChange={(e) => setEditCategory(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl" /></div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setEditingPlan(null)} className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl hover:bg-gray-300">Batal</button>
                <button onClick={handleSaveEdit} className="flex-1 bg-yellow-400 text-blue-900 py-3 rounded-xl hover:bg-yellow-500">Simpan</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
