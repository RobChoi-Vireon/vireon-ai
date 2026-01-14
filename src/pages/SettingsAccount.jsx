import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail } from 'lucide-react';
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
  >
    <div className="absolute inset-0 opacity-30 pointer-events-none">
      <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
    {children}
  </motion.div>
);

export default function SettingsAccount() {
  const handleAction = (action) => {
    toast.success(`${action} (demo mode)`);
  };

  return (
    <div>
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-black text-white tracking-[-0.02em] mb-2">Account</h1>
        <p className="text-gray-300 text-base">Manage your profile and account settings.</p>
      </motion.div>

      <div className="space-y-6">
        {/* Profile Information */}
        <GlassCard>
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Profile Information</h2>
              <Button
                onClick={() => handleAction('Edit Profile')}
                variant="outline"
                className="h-10 px-5 rounded-xl bg-white/5 border-white/10 hover:bg-white/10 text-white font-medium"
              >
                Edit Profile
              </Button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center">
                  <User className="w-8 h-8 text-blue-300" />
                </div>
                <div>
                  <p className="text-base font-semibold text-white">John Investor</p>
                  <p className="text-sm text-gray-400 mt-0.5">Joined Dec 2025</p>
                </div>
              </div>
              <div className="pt-4 border-t border-white/5 space-y-3">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Email Address</p>
                  <p className="text-sm text-white">investor@vireon.ai</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Username</p>
                  <p className="text-sm text-white">@johninvestor</p>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Email Preferences */}
        <GlassCard>
          <div className="p-8">
            <h2 className="text-xl font-bold text-white mb-6">Email Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">Marketing Emails</p>
                  <p className="text-xs text-gray-400 mt-0.5">Receive updates about new features</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">Security Alerts</p>
                  <p className="text-xs text-gray-400 mt-0.5">Important account security notifications</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Danger Zone */}
        <GlassCard>
          <div className="p-8">
            <h2 className="text-xl font-bold text-red-300 mb-4">Danger Zone</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-red-500/5 border border-red-500/20">
                <div>
                  <p className="text-sm font-semibold text-white">Delete Account</p>
                  <p className="text-xs text-gray-400 mt-0.5">Permanently delete your account and all data</p>
                </div>
                <Button
                  onClick={() => handleAction('Delete Account')}
                  className="h-10 px-5 rounded-xl bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 text-red-300 font-semibold"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}