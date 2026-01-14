import React from 'react';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';

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

const NotificationRow = ({ title, description, defaultChecked = false }) => (
  <div className="flex items-center justify-between py-4">
    <div>
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="text-xs text-gray-400 mt-0.5">{description}</p>
    </div>
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" className="sr-only peer" defaultChecked={defaultChecked} />
      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
    </label>
  </div>
);

export default function SettingsNotifications() {
  return (
    <div>
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-black text-white tracking-[-0.02em] mb-2">Notifications</h1>
        <p className="text-gray-300 text-base">Manage how you receive notifications.</p>
      </motion.div>

      <div className="space-y-6">
        {/* Email Notifications */}
        <GlassCard>
          <div className="p-8">
            <h2 className="text-xl font-bold text-white mb-6">Email Notifications</h2>
            <div className="divide-y divide-white/5">
              <NotificationRow
                title="Market Alerts"
                description="Get notified about significant market movements"
                defaultChecked={true}
              />
              <NotificationRow
                title="Watchlist Updates"
                description="Alerts for stocks in your watchlist"
                defaultChecked={true}
              />
              <NotificationRow
                title="Weekly Summary"
                description="Receive a weekly market summary email"
                defaultChecked={false}
              />
            </div>
          </div>
        </GlassCard>

        {/* Push Notifications */}
        <GlassCard>
          <div className="p-8">
            <h2 className="text-xl font-bold text-white mb-6">Push Notifications</h2>
            <div className="divide-y divide-white/5">
              <NotificationRow
                title="Price Alerts"
                description="Real-time price movement notifications"
                defaultChecked={true}
              />
              <NotificationRow
                title="News Alerts"
                description="Breaking news about your watchlist"
                defaultChecked={true}
              />
              <NotificationRow
                title="System Updates"
                description="App updates and maintenance notices"
                defaultChecked={false}
              />
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}