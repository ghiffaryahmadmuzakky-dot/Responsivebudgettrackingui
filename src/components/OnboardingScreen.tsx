import { useState } from 'react';
import { ChevronLeft, ChevronRight, Wallet, TrendingUp, PieChart } from 'lucide-react';

interface OnboardingScreenProps {
  onLogin: () => void;
  onSignUp: () => void;
}

const slides = [
  {
    icon: Wallet,
    title: 'Kelola Anggaran',
    description: 'Atur dan pantau pengeluaran bulanan kamu dengan mudah'
  },
  {
    icon: TrendingUp,
    title: 'Lacak Pengeluaran',
    description: 'Catat setiap transaksi dan lihat kemana uangmu pergi'
  },
  {
    icon: PieChart,
    title: 'Statistik Lengkap',
    description: 'Analisis pola pengeluaran dengan visualisasi yang jelas'
  }
];

export function OnboardingScreen({ onLogin, onSignUp }: OnboardingScreenProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const CurrentIcon = slides[currentSlide].icon;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 pb-32">
        <div className="bg-blue-100 rounded-full p-8 mb-8">
          <CurrentIcon className="w-24 h-24 text-blue-900" strokeWidth={1.5} />
        </div>
        
        <h1 className="text-blue-900 text-3xl md:text-4xl text-center mb-4">
          {slides[currentSlide].title}
        </h1>
        
        <p className="text-gray-600 text-center max-w-md">
          {slides[currentSlide].description}
        </p>

        {/* Slide Indicators */}
        <div className="flex gap-2 mt-8">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide ? 'w-8 bg-yellow-500' : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Navigation Arrows */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={prevSlide}
            className="bg-gray-100 p-3 rounded-full hover:bg-gray-200 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <button
            onClick={nextSlide}
            className="bg-gray-100 p-3 rounded-full hover:bg-gray-200 transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Bottom Buttons */}
      <div className="px-8 pb-8 space-y-4">
        <button
          onClick={onSignUp}
          className="w-full bg-yellow-500 text-blue-900 py-4 rounded-xl hover:bg-yellow-600 transition-colors"
        >
          Daftar Sekarang
        </button>
        <button
          onClick={onLogin}
          className="w-full bg-blue-900 text-white py-4 rounded-xl border-2 border-blue-900 hover:bg-blue-800 transition-colors"
        >
          Masuk
        </button>
      </div>
    </div>
  );
}