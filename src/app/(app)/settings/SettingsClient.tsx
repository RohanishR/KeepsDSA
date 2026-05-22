'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

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
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  const togglePrivacy = (key: keyof PrivacySettings) => {
    setPrivacy(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display-sm text-[32px] font-bold text-on-surface">Account Settings</h1>
        <p className="text-on-surface-variant">Manage your profile identity and privacy preferences.</p>
      </motion.div>

      {message.text && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`p-4 rounded-lg mb-8 text-sm font-medium ${message.type === 'success' ? 'bg-primary/20 text-primary' : 'bg-error/20 text-error'}`}>
          {message.text}
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column - Profile Settings */}
        <div className="md:col-span-2 space-y-8">
          
          <div className="glass-panel p-6 rounded-xl">
            <h2 className="text-xl font-bold text-on-surface mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">person</span>
              Public Profile
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-on-surface-variant mb-2">Username</label>
                <div className="flex gap-2">
                  <span className="inline-flex items-center px-4 rounded-l-lg bg-surface-container border border-r-0 border-outline-variant/30 text-on-surface-variant text-sm">
                    keepsdsa.com/u/
                  </span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="flex-1 bg-surface-container-low border border-outline-variant/30 text-on-surface text-sm rounded-r-lg focus:ring-primary focus:border-primary block p-2.5 transition-colors"
                    placeholder="johndoe"
                  />
                </div>
                <p className="mt-2 text-xs text-on-surface-variant">This will be your public URL. Only lowercase letters and numbers are allowed.</p>
              </div>

              <div className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-lg border border-outline-variant/10">
                <div>
                  <h3 className="text-on-surface font-medium text-sm">Make Profile Public</h3>
                  <p className="text-on-surface-variant text-xs mt-1">Allow anyone with your link to view your portfolio and stats.</p>
                </div>
                <button
                  onClick={() => togglePrivacy('isProfilePublic')}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${privacy.isProfilePublic ? 'bg-primary' : 'bg-surface-container-highest'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${privacy.isProfilePublic ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </div>

          <motion.div 
            initial={false}
            animate={{ opacity: privacy.isProfilePublic ? 1 : 0.5, pointerEvents: privacy.isProfilePublic ? 'auto' : 'none' }}
            className="glass-panel p-6 rounded-xl"
          >
            <h2 className="text-xl font-bold text-on-surface mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">visibility</span>
              Sharing Preferences
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-lg border border-outline-variant/10">
                <div>
                  <h3 className="text-on-surface font-medium text-sm">Show Stats & Heatmap</h3>
                  <p className="text-on-surface-variant text-xs mt-1">Display your total solved, streak, and activity heatmap.</p>
                </div>
                <button
                  onClick={() => togglePrivacy('showStats')}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${privacy.showStats ? 'bg-primary' : 'bg-surface-container-highest'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${privacy.showStats ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-lg border border-outline-variant/10">
                <div>
                  <h3 className="text-on-surface font-medium text-sm">Share Solutions Globally</h3>
                  <p className="text-on-surface-variant text-xs mt-1">Make all your optimal solutions visible on your public problem pages.</p>
                </div>
                <button
                  onClick={() => togglePrivacy('showSolutions')}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${privacy.showSolutions ? 'bg-primary' : 'bg-surface-container-highest'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${privacy.showSolutions ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-lg border border-outline-variant/10">
                <div>
                  <h3 className="text-on-surface font-medium text-sm">Share Notes Globally</h3>
                  <p className="text-on-surface-variant text-xs mt-1">Make your personal Markdown notes visible to others.</p>
                </div>
                <button
                  onClick={() => togglePrivacy('showNotes')}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${privacy.showNotes ? 'bg-primary' : 'bg-surface-container-highest'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${privacy.showNotes ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </motion.div>

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-primary text-on-primary px-6 py-2.5 rounded-lg font-bold shadow-md hover:bg-primary-fixed hover:text-on-primary-fixed transition-colors flex items-center gap-2"
            >
              {isSaving ? <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span> : <span className="material-symbols-outlined text-[18px]">save</span>}
              Save Changes
            </button>
          </div>
        </div>

        {/* Right Column - User Overview */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-xl flex flex-col items-center text-center">
            {initialData.image ? (
              <img src={initialData.image} alt="Profile" className="w-24 h-24 rounded-full mb-4 border-4 border-surface" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-surface-container-highest flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[40px] text-primary">person</span>
              </div>
            )}
            <h2 className="text-xl font-bold text-on-surface">{initialData.name}</h2>
            <p className="text-sm text-on-surface-variant mb-6">{initialData.email}</p>
            
            {privacy.isProfilePublic && (
              <a 
                href={`/u/${username}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-surface-container-high text-on-surface px-4 py-2 rounded-lg text-sm font-medium hover:bg-surface-container-highest transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                View Public Profile
              </a>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
