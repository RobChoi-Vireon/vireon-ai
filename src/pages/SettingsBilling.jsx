import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Download, ExternalLink, HelpCircle, AlertCircle, CheckCircle2, Clock, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const GlassCard = ({ children, className = "" }) => (
  <motion.div
    className={`relative overflow-hidden rounded-3xl border backdrop-blur-xl ${className}`}
    style={{
      background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.6), rgba(10, 12, 18, 0.7))',
      borderColor: 'rgba(79, 70, 229, 0.15)',
    }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
    whileHover={{ y: -2 }}
  >
    {/* Subtle inner glow */}
    <div className="absolute inset-0 opacity-30 pointer-events-none">
      <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
    {children}
  </motion.div>
);

const StatusPill = ({ status, tooltip }) => {
  const config = {
    Active: { color: 'text-emerald-400', bg: 'bg-emerald-500/15', border: 'border-emerald-500/25', icon: CheckCircle2 },
    Trialing: { color: 'text-cyan-400', bg: 'bg-cyan-500/15', border: 'border-cyan-500/25', icon: Clock },
    'Past Due': { color: 'text-red-400', bg: 'bg-red-500/15', border: 'border-red-500/25', icon: AlertCircle },
    Paid: { color: 'text-emerald-400', bg: 'bg-emerald-500/15', border: 'border-emerald-500/25', icon: CheckCircle2 },
    Open: { color: 'text-yellow-400', bg: 'bg-yellow-500/15', border: 'border-yellow-500/25', icon: Clock },
    Failed: { color: 'text-red-400', bg: 'bg-red-500/15', border: 'border-red-500/25', icon: AlertCircle },
  };

  const { color, bg, border, icon: Icon } = config[status] || config.Active;

  return (
    <div className="group relative">
      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${color} ${bg} ${border}`}>
        <Icon className="w-3.5 h-3.5" />
        {status}
      </div>
      {tooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg bg-black/90 text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none backdrop-blur-xl border border-white/10">
          {tooltip}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px w-2 h-2 rotate-45 bg-black/90 border-r border-b border-white/10" />
        </div>
      )}
    </div>
  );
};

const CancelPlanModal = ({ isOpen, onClose, onConfirm }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        >
          <div
            className="relative w-full max-w-md rounded-3xl border backdrop-blur-xl p-8"
            style={{
              background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.95), rgba(10, 12, 18, 0.98))',
              borderColor: 'rgba(239, 68, 68, 0.25)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)'
            }}
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-red-500/15 border border-red-500/25 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">Cancel your plan?</h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  You'll keep access until the end of your current billing period (Jan 28, 2026). After that, your account will be downgraded.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1 h-11 rounded-xl bg-white/5 border-white/10 hover:bg-white/10 text-white font-medium"
              >
                Keep Plan
              </Button>
              <Button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="flex-1 h-11 rounded-xl bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 text-red-300 font-semibold"
              >
                Cancel Plan
              </Button>
            </div>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

export default function SettingsBilling() {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [planStatus, setPlanStatus] = useState('Active'); // Active, Trialing, Past Due, Canceled, No Subscription

  const handleCancelPlan = () => {
    setPlanStatus('Canceled');
    toast.success('Plan canceled. Access until Jan 28, 2026.');
  };

  const handleAction = (action) => {
    toast.success(`${action} (demo mode)`);
  };

  const invoices = [
    { date: 'Jan 1, 2026', description: 'Vireon Sentinel — Monthly', amount: '$149.00', status: 'Paid' },
    { date: 'Dec 1, 2025', description: 'Vireon Sentinel — Monthly', amount: '$149.00', status: 'Paid' },
    { date: 'Nov 1, 2025', description: 'Vireon Sentinel — Monthly', amount: '$149.00', status: 'Paid' },
    { date: 'Oct 1, 2025', description: 'Vireon Sentinel — Monthly', amount: '$149.00', status: 'Paid' },
    { date: 'Sep 1, 2025', description: 'Vireon Sentinel — Monthly', amount: '$149.00', status: 'Paid' },
  ];

  return (
    <div className="min-h-screen font-sans overflow-x-hidden" style={{ background: '#0B0E13', color: '#F8FAFC' }}>
      {/* Atmospheric Canvas */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(12, 14, 18, 1) 0%, rgba(11, 14, 19, 1) 50%, rgba(10, 12, 16, 1) 100%)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 20%, rgba(110, 180, 255, 0.015) 0%, transparent 60%)' }} />
        <div className="absolute inset-0 opacity-[0.012] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 300 300\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.18) 100%)' }} />
      </div>

      <main className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-8 max-w-5xl">
        {/* Header */}
        <motion.div
          className="mb-8 flex items-start justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h1 className="text-4xl font-black text-white tracking-[-0.02em] mb-2">Billing</h1>
            <p className="text-gray-300 text-base">Manage your plan and payment details.</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => handleAction('View Plans')}
              variant="outline"
              className="h-10 px-5 rounded-xl bg-white/5 border-white/10 hover:bg-white/10 text-white font-medium text-sm"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View Plans
            </Button>
            <Button
              onClick={() => handleAction('Contact Support')}
              variant="outline"
              className="h-10 px-5 rounded-xl bg-white/5 border-white/10 hover:bg-white/10 text-white font-medium text-sm"
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              Contact Support
            </Button>
          </div>
        </motion.div>

        {/* Cards Stack */}
        <div className="space-y-6">
          {/* Current Plan */}
          <GlassCard>
            <div className="p-8">
              {/* Status Banner */}
              {planStatus === 'Past Due' && (
                <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-red-300">Payment Failed</p>
                    <p className="text-xs text-red-200/80 mt-0.5">Please update your payment method to continue service.</p>
                  </div>
                </div>
              )}

              {planStatus === 'Trialing' && (
                <div className="mb-6 p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center gap-3">
                  <Clock className="w-5 h-5 text-cyan-400" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-cyan-300">Trial Period</p>
                    <p className="text-xs text-cyan-200/80 mt-0.5">14 days remaining. Add a payment method to continue after trial.</p>
                  </div>
                </div>
              )}

              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white mb-3">Current Plan</h2>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <p className="text-3xl font-black text-white">Sentinel</p>
                      <StatusPill status={planStatus} tooltip="Your plan renews automatically on Jan 28, 2026" />
                    </div>
                    <p className="text-2xl font-bold text-blue-300">$149 <span className="text-base font-medium text-gray-400">/ month</span></p>
                    <p className="text-sm text-gray-400">Renews Jan 28, 2026</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => handleAction('Manage Subscription')}
                  className="h-11 px-6 rounded-xl bg-gradient-to-r from-indigo-500/20 to-violet-500/20 border border-indigo-500/30 hover:from-indigo-500/30 hover:to-violet-500/30 text-white font-semibold"
                >
                  Manage Subscription
                </Button>
                <Button
                  onClick={() => handleAction('Change Plan')}
                  variant="outline"
                  className="h-11 px-6 rounded-xl bg-white/5 border-white/10 hover:bg-white/10 text-white font-medium"
                >
                  Change Plan
                </Button>
                <Button
                  onClick={() => setShowCancelModal(true)}
                  variant="outline"
                  className="h-11 px-6 rounded-xl bg-red-500/5 border-red-500/20 hover:bg-red-500/10 text-red-300 font-medium"
                >
                  Cancel Plan
                </Button>
              </div>
            </div>
          </GlassCard>

          {/* Payment Method */}
          <GlassCard>
            <div className="p-8">
              <h2 className="text-xl font-bold text-white mb-6">Payment Method</h2>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center">
                    <CreditCard className="w-7 h-7 text-blue-300" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-white">Visa •••• 4242</p>
                    <p className="text-sm text-gray-400 mt-0.5">Exp 09/27</p>
                  </div>
                </div>
                <Button
                  onClick={() => handleAction('Update Card')}
                  variant="outline"
                  className="h-10 px-5 rounded-xl bg-white/5 border-white/10 hover:bg-white/10 text-white font-medium"
                >
                  Update Card
                </Button>
              </div>
            </div>
          </GlassCard>

          {/* Billing History */}
          <GlassCard>
            <div className="p-8">
              <h2 className="text-xl font-bold text-white mb-6">Billing History</h2>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {invoices.map((invoice, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white">{invoice.date}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{invoice.description}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-sm font-bold text-white">{invoice.amount}</p>
                      <StatusPill status={invoice.status} />
                      <Button
                        onClick={() => handleAction('Download Invoice')}
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </GlassCard>

          {/* Billing Details */}
          <GlassCard>
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Billing Details</h2>
                <Button
                  onClick={() => handleAction('Edit Billing Details')}
                  variant="outline"
                  className="h-10 px-5 rounded-xl bg-white/5 border-white/10 hover:bg-white/10 text-white font-medium"
                >
                  Edit Details
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Billing Email</p>
                  <p className="text-sm text-white">investor@vireon.ai</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Legal Name</p>
                  <p className="text-sm text-white">Vireon Capital, LLC</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Address</p>
                  <p className="text-sm text-white">1234 Market St, San Francisco, CA 94103</p>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </main>

      <CancelPlanModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelPlan}
      />
    </div>
  );
}