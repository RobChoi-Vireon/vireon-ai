import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, CreditCard, Shield, Bell } from 'lucide-react';
import { createPageUrl } from '@/utils';
import SettingsBilling from './SettingsBilling';
import SettingsAccount from './SettingsAccount';
import SettingsSecurity from './SettingsSecurity';
import SettingsNotifications from './SettingsNotifications';

const SubNavLink = ({ href, icon: Icon, label, isActive }) => (
  <Link to={href} className="block">
    <motion.div
      className="relative flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors"
      style={{
        background: isActive 
          ? 'linear-gradient(135deg, rgba(107, 115, 255, 0.12) 0%, rgba(79, 70, 229, 0.12) 100%)'
          : 'transparent',
        border: isActive ? '1px solid rgba(107, 115, 255, 0.2)' : '1px solid transparent'
      }}
      whileHover={!isActive ? {
        background: 'rgba(255, 255, 255, 0.03)'
      } : {}}
      whileTap={{ scale: 0.98 }}
    >
      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: 'radial-gradient(ellipse at 50% 30%, rgba(107, 115, 255, 0.08) 0%, transparent 70%)'
          }}
          layoutId="activeSettingsTab"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
      <Icon 
        className="w-5 h-5 relative z-10" 
        style={{ 
          color: isActive ? 'rgba(147, 197, 253, 0.9)' : 'rgba(156, 163, 175, 0.8)',
          strokeWidth: 2
        }} 
      />
      <span 
        className="text-sm font-medium relative z-10"
        style={{ 
          color: isActive ? 'rgba(255, 255, 255, 0.95)' : 'rgba(156, 163, 175, 0.85)'
        }}
      >
        {label}
      </span>
    </motion.div>
  </Link>
);

export default function Settings() {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { path: createPageUrl('Settings', { tab: 'account' }), icon: User, label: 'Account' },
    { path: createPageUrl('Settings', { tab: 'billing' }), icon: CreditCard, label: 'Billing' },
    { path: createPageUrl('Settings', { tab: 'security' }), icon: Shield, label: 'Security' },
    { path: createPageUrl('Settings', { tab: 'notifications' }), icon: Bell, label: 'Notifications' },
  ];

  // Parse tab from URL
  const urlParams = new URLSearchParams(window.location.search);
  const currentTab = urlParams.get('tab') || 'account';

  const renderContent = () => {
    switch (currentTab) {
      case 'billing':
        return <SettingsBilling />;
      case 'security':
        return <SettingsSecurity />;
      case 'notifications':
        return <SettingsNotifications />;
      case 'account':
      default:
        return <SettingsAccount />;
    }
  };

  return (
    <div className="min-h-screen font-sans" style={{ background: '#0B0E13', color: '#F8FAFC' }}>
      {/* Atmospheric Canvas */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(12, 14, 18, 1) 0%, rgba(11, 14, 19, 1) 50%, rgba(10, 12, 16, 1) 100%)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 20%, rgba(110, 180, 255, 0.015) 0%, transparent 60%)' }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar Navigation */}
          <div className="lg:col-span-3">
            <motion.div
              className="sticky top-8 rounded-3xl border backdrop-blur-xl p-6"
              style={{
                background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.6), rgba(10, 12, 18, 0.7))',
                borderColor: 'rgba(79, 70, 229, 0.15)',
              }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-lg font-bold text-white mb-4 px-4">Settings</h2>
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <SubNavLink
                    key={item.path}
                    href={item.path}
                    icon={item.icon}
                    label={item.label}
                    isActive={currentPath.includes(item.label.toLowerCase()) || (item.label.toLowerCase() === currentTab)}
                  />
                ))}
              </nav>
            </motion.div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9">
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {renderContent()}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}