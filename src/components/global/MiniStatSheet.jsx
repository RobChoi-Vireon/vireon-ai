import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BellPlus, BarChart, TrendingUp, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';

// A simple sparkline component
const Sparkline = ({ theme }) => (
  <svg width="100%" height="40" viewBox="0 0 100 40" preserveAspectRatio="none">
    <path
      d="M 0 20 L 10 25 L 20 15 L 30 22 L 40 18 L 50 30 L 60 25 L 70 15 L 80 20 L 90 10 L 100 15"
      fill="none"
      stroke={theme === 'dark' ? '#3b82f6' : '#2563eb'}
      strokeWidth="2"
    />
  </svg>
);

const Metric = ({ icon: Icon, label, value, theme }) => (
  <div className="text-center">
    <Icon className={`w-5 h-5 mx-auto mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
    <p className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{label}</p>
    <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{value}</p>
  </div>
);

export default function MiniStatSheet({ isOpen, onClose, data, position }) {
  const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';

  const sheetVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 10 },
    visible: { opacity: 1, scale: 1, y: 0 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[55] bg-black/10"
            onClick={onClose}
          />
          <motion.div
            variants={sheetVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ type: 'spring', stiffness: 500, damping: 30, duration: 0.2 }}
            className={`
              fixed z-[60] w-72 rounded-2xl p-5
              ${theme === 'dark' 
                ? 'bg-gradient-to-br from-[#1A1D29]/95 to-[#12141C]/95 border border-white/10' 
                : 'bg-gradient-to-br from-white/95 to-white/90 border border-black/[0.08]'
              }
              backdrop-blur-xl shadow-2xl
            `}
            style={{
              top: position.top + 15,
              left: position.left,
              transform: 'translateX(-50%)',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{data?.symbol}</h3>
              <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10">
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            <Sparkline theme={theme} />
            
            <div className="grid grid-cols-3 gap-4 my-4">
              <Metric icon={TrendingUp} label="52W High" value="$215.50" theme={theme} />
              <Metric icon={BarChart} label="Avg Vol" value="55.2M" theme={theme} />
              <Metric icon={DollarSign} label="Mkt Cap" value="$2.8T" theme={theme} />
            </div>

            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold">
              <BellPlus className="w-4 h-4 mr-2" />
              Set Alert
            </Button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}