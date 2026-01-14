import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Key, Smartphone } from 'lucide-react';
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

export default function SettingsSecurity() {
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
        <h1 className="text-4xl font-black text-white tracking-[-0.02em] mb-2">Security</h1>
        <p className="text-gray-300 text-base">Manage your account security and authentication.</p>
      </motion.div>

      <div className="space-y-6">
        {/* Password */}
        <GlassCard>
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-2">Password</h2>
                <p className="text-sm text-gray-400">Last changed 3 months ago</p>
              </div>
              <Button
                onClick={() => handleAction('Change Password')}
                variant="outline"
                className="h-10 px-5 rounded-xl bg-white/5 border-white/10 hover:bg-white/10 text-white font-medium"
              >
                Change Password
              </Button>
            </div>
          </div>
        </GlassCard>

        {/* Two-Factor Authentication */}
        <GlassCard>
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-emerald-300" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">Two-Factor Authentication</h2>
                  <p className="text-sm text-gray-400">Add an extra layer of security to your account</p>
                  <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/25">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-xs font-semibold text-emerald-300">Enabled</span>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => handleAction('Manage 2FA')}
                variant="outline"
                className="h-10 px-5 rounded-xl bg-white/5 border-white/10 hover:bg-white/10 text-white font-medium"
              >
                Manage
              </Button>
            </div>
          </div>
        </GlassCard>

        {/* Active Sessions */}
        <GlassCard>
          <div className="p-8">
            <h2 className="text-xl font-bold text-white mb-6">Active Sessions</h2>
            <div className="space-y-3">
              {[
                { device: 'MacBook Pro', location: 'San Francisco, CA', active: true },
                { device: 'iPhone 15 Pro', location: 'San Francisco, CA', active: false },
              ].map((session, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <div>
                    <p className="text-sm font-semibold text-white">{session.device}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{session.location} • {session.active ? 'Active now' : 'Last seen 2 hours ago'}</p>
                  </div>
                  <Button
                    onClick={() => handleAction('Revoke Session')}
                    variant="ghost"
                    className="h-9 px-4 rounded-lg hover:bg-red-500/10 text-red-300 font-medium text-sm"
                  >
                    Revoke
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}