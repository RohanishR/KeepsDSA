'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

interface PrivacySettings {
  isProfilePublic: boolean;
  showStats: boolean;
  showSolutions: boolean;
  showNotes: boolean;
}

interface SettingsData {
  name: string;
  email: string;
  image?: string;
  username: string;
  privacySettings: PrivacySettings;
}

export default function SettingsClient({ initialData }: { initialData: SettingsData }) {
  const [username, setUsername] = useState(initialData.username);
  const [privacy, setPrivacy] = useState<PrivacySettings>(initialData.privacySettings);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isSuccess, setIsSuccess] = useState(false);

  // Auto-dismiss messages
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: '', text: '' });
        setIsSuccess(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, privacySettings: privacy }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save settings');
      }

      setMessage({ type: 'success', text: 'Settings saved successfully!' });
      setUsername(data.username);
      setIsSuccess(true);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
      setIsSuccess(false);
    } finally {
      setIsSaving(false);
    }
  };

  const togglePrivacy = (key: keyof PrivacySettings) => {
    setPrivacy(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
  };

  // Animated Toggle Switch Component
  const ToggleSwitch = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`w-12 h-6 rounded-full p-1 flex items-center transition-colors duration-300 ${checked ? 'bg-primary' : 'bg-surface-container-highest'}`}
    >
      <motion.div 
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={`w-4 h-4 rounded-full bg-white shadow-sm ${checked ? 'ml-auto' : ''}`}
      />
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-8">
        <h1 className="font-display-sm text-[32px] font-bold text-on-surface">Account Settings</h1>
        <p className="text-on-surface-variant">Manage your profile identity and privacy preferences.</p>
      </motion.div>

      <AnimatePresence mode="wait">
        {message.text && (
          <motion.div 
            initial={{ opacity: 0, y: -20, height: 0 }} 
            animate={{ opacity: 1, y: 0, height: 'auto' }} 
            exit={{ opacity: 0, y: -20, height: 0 }}
            className={`p-4 rounded-lg mb-8 text-sm font-medium flex items-center gap-2 ${message.type === 'success' ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-error/20 text-error border border-error/30'}`}
          >
            <span className="material-symbols-outlined text-[20px]">{message.type === 'success' ? 'check_circle' : 'error'}</span>
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {/* Left Column - Profile Settings */}
        <div className="md:col-span-2 space-y-8">
          
          <motion.div variants={itemVariants} className="glass-panel p-6 rounded-xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none"></div>
            <h2 className="text-xl font-bold text-on-surface mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">person</span>
              Public Profile
            </h2>

            <div className="space-y-6 relative z-10">
              <div className="focus-glow rounded-lg">
                <label className="block text-sm font-bold text-on-surface-variant mb-2">Username</label>
                <div className="flex">
                  <span className="inline-flex items-center px-4 rounded-l-lg bg-surface-container border border-r-0 border-outline-variant/30 text-on-surface-variant text-sm">
                    keepsdsa.com/u/
                  </span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="flex-1 bg-surface-container-low border border-outline-variant/30 text-on-surface text-sm rounded-r-lg focus:ring-primary focus:border-primary block p-2.5 transition-colors focus:outline-none"
                    placeholder="johndoe"
                  />
                </div>
                <p className="mt-2 text-xs text-on-surface-variant">This will be your public URL. Only lowercase letters and numbers are allowed.</p>
              </div>

              <div className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-lg border border-outline-variant/10 hover:border-primary/30 transition-colors">
                <div>
                  <h3 className="text-on-surface font-medium text-sm">Make Profile Public</h3>
                  <p className="text-on-surface-variant text-xs mt-1">Allow anyone with your link to view your portfolio and stats.</p>
                </div>
                <ToggleSwitch checked={privacy.isProfilePublic} onChange={() => togglePrivacy('isProfilePublic')} />
              </div>
            </div>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            animate={{ opacity: privacy.isProfilePublic ? 1 : 0.5 }}
            transition={{ duration: 0.3 }}
            className={`glass-panel p-6 rounded-xl ${!privacy.isProfilePublic ? 'pointer-events-none' : ''}`}
          >
            <h2 className="text-xl font-bold text-on-surface mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">visibility</span>
              Sharing Preferences
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-lg border border-outline-variant/10 hover:border-primary/30 transition-colors">
                <div>
                  <h3 className="text-on-surface font-medium text-sm">Show Stats & Heatmap</h3>
                  <p className="text-on-surface-variant text-xs mt-1">Display your total solved, streak, and activity heatmap.</p>
                </div>
                <ToggleSwitch checked={privacy.showStats} onChange={() => togglePrivacy('showStats')} />
              </div>

              <div className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-lg border border-outline-variant/10 hover:border-primary/30 transition-colors">
                <div>
                  <h3 className="text-on-surface font-medium text-sm">Share Solutions Globally</h3>
                  <p className="text-on-surface-variant text-xs mt-1">Make all your optimal solutions visible on your public problem pages.</p>
                </div>
                <ToggleSwitch checked={privacy.showSolutions} onChange={() => togglePrivacy('showSolutions')} />
              </div>

              <div className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-lg border border-outline-variant/10 hover:border-primary/30 transition-colors">
                <div>
                  <h3 className="text-on-surface font-medium text-sm">Share Notes Globally</h3>
                  <p className="text-on-surface-variant text-xs mt-1">Make your personal Markdown notes visible to others.</p>
                </div>
                <ToggleSwitch checked={privacy.showNotes} onChange={() => togglePrivacy('showNotes')} />
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="flex justify-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              disabled={isSaving}
              className={`px-6 py-2.5 rounded-lg font-bold shadow-md transition-all flex items-center gap-2 ${
                isSuccess 
                  ? 'bg-secondary text-on-secondary shadow-secondary/20' 
                  : 'bg-primary text-on-primary hover:bg-primary-fixed hover:text-on-primary-fixed shadow-primary/20 hover:shadow-primary/40'
              }`}
            >
              {isSaving ? (
                <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
              ) : isSuccess ? (
                <motion.span 
                  initial={{ scale: 0 }} 
                  animate={{ scale: 1 }} 
                  className="material-symbols-outlined text-[18px]"
                >
                  check_circle
                </motion.span>
              ) : (
                <span className="material-symbols-outlined text-[18px]">save</span>
              )}
              {isSaving ? 'Saving...' : isSuccess ? 'Saved!' : 'Save Changes'}
            </motion.button>
          </motion.div>
        </div>

        {/* Right Column - User Overview */}
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="glass-panel p-6 rounded-xl flex flex-col items-center text-center group card-hover">
            <div className="relative mb-4">
              {initialData.image ? (
                <img src={initialData.image} alt="Profile" className="w-24 h-24 rounded-full border-4 border-surface shadow-[0_0_15px_rgba(188,195,255,0.2)] group-hover:shadow-[0_0_25px_rgba(188,195,255,0.4)] transition-shadow duration-300" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-surface-container-highest flex items-center justify-center border-4 border-surface shadow-[0_0_15px_rgba(188,195,255,0.2)] group-hover:shadow-[0_0_25px_rgba(188,195,255,0.4)] transition-shadow duration-300">
                  <span className="material-symbols-outlined text-[40px] text-primary">person</span>
                </div>
              )}
              <div className="absolute inset-0 rounded-full border border-primary/0 group-hover:border-primary/50 transition-colors duration-300"></div>
            </div>
            
            <h2 className="text-xl font-bold text-on-surface group-hover:text-primary transition-colors duration-300">{initialData.name}</h2>
            <p className="text-sm text-on-surface-variant mb-6">{initialData.email}</p>
            
            <AnimatePresence>
              {privacy.isProfilePublic && (
                <motion.a 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  href={`/u/${username}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-surface-container-high text-on-surface px-4 py-2 rounded-lg text-sm font-medium hover:bg-surface-container-highest hover:text-primary transition-colors overflow-hidden"
                >
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                  View Public Profile
                </motion.a>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}
