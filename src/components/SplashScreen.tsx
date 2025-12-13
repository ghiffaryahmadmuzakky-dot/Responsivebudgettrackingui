import { motion } from 'motion/react';
import { Coins } from 'lucide-react';

export function SplashScreen() {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 20,
          duration: 1
        }}
      >
        <motion.div
          animate={{
            y: [0, -20, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut'
          }}
        >
          <Coins className="w-32 h-32 text-yellow-500" strokeWidth={1.5} />
        </motion.div>
      </motion.div>
      
      <motion.div
        className="absolute bottom-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <p className="text-blue-900 text-xl tracking-wider">Budget Mahasiswa</p>
      </motion.div>
    </div>
  );
}