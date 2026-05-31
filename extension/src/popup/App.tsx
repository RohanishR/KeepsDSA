import React, { useState, useEffect } from 'react';
import { LogOut, Code2, CloudCog } from 'lucide-react';
import { API_URL, WEB_URL } from '../config';

export default function App() {
  const [token, setToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<{name?: string, image?: string} | null>(null);
  const [inputToken, setInputToken] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    chrome.storage.local.get(['keepsDsaToken', 'profileName', 'profileImage'], async (result) => {
      if (result.keepsDsaToken) {
        setToken(result.keepsDsaToken);
        if (result.profileName) {
          setProfile({ name: result.profileName, image: result.profileImage });
        } else {
          // Fetch profile if we only had the token (legacy support)
          try {
            const res = await fetch(`${API_URL}/auth`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token: result.keepsDsaToken })
            });
            const data = await res.json();
            if (res.ok && data.name) {
              setProfile({ name: data.name, image: data.image });
              chrome.storage.local.set({ profileName: data.name, profileImage: data.image });
            }
          } catch(e) {}
        }
      }
    });
  }, []);

  const handleSaveToken = async () => {
    if (!inputToken.trim()) return;
    setIsVerifying(true);
    setError('');
    
    try {
      const res = await fetch(`${API_URL}/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: inputToken.trim() })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Authentication failed');
      
      await chrome.storage.local.set({ 
        keepsDsaToken: inputToken.trim(),
        profileName: data.name,
        profileImage: data.image
      });
      setToken(inputToken.trim());
      setProfile({ name: data.name, image: data.image });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogout = async () => {
    await chrome.storage.local.remove(['keepsDsaToken', 'profileName', 'profileImage']);
    setToken(null);
    setProfile(null);
    setInputToken('');
  };

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-primary/10 blur-[60px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[50%] h-[50%] bg-blue-500/10 blur-[60px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 w-full flex flex-col items-center">
          <div className="w-16 h-16 bg-card border border-border/40 rounded-2xl flex items-center justify-center shadow-lg mb-6 shadow-primary/20">
            <Code2 className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-2 font-heading tracking-tight text-foreground">KeepsDSA Vault</h1>
          <p className="text-muted-foreground text-[13px] mb-8 leading-relaxed">
            Sync your LeetCode progress directly into your personal vault.
          </p>
          
          <div className="w-full space-y-3">
            <div>
              <input
                type="password"
                placeholder="Paste Extension API Key..."
                value={inputToken}
                onChange={(e) => setInputToken(e.target.value)}
                className="w-full bg-accent/50 border border-border/50 rounded-xl px-4 py-3.5 text-[13px] text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground"
              />
              {error && <p className="text-red-400 text-xs text-left mt-2 pl-1">{error}</p>}
            </div>
            
            <button
              onClick={handleSaveToken}
              disabled={isVerifying || !inputToken.trim()}
              className="w-full bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground text-primary-foreground font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:shadow-none"
            >
              {isVerifying ? (
                <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Connect Account'
              )}
            </button>
          </div>
          
          <a href={`${WEB_URL}/extension`} target="_blank" rel="noreferrer" className="text-primary text-[12px] font-medium mt-6 hover:underline decoration-primary/50 underline-offset-4 transition-all">
            Get your API key from Settings &rarr;
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full relative overflow-hidden bg-background">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-primary/5 blur-[80px] rounded-full pointer-events-none"></div>

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border/40 glass-panel relative z-10">
        <div className="flex items-center gap-3">
          {profile?.image ? (
            <img src={profile.image} alt="Profile" className="w-8 h-8 rounded-full border border-border/50 object-cover" />
          ) : (
            <div className="w-8 h-8 bg-card border border-border/30 rounded-lg flex items-center justify-center shadow-sm shadow-primary/10">
              <Code2 className="w-4 h-4 text-primary" />
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-heading font-bold text-[14px] tracking-wide text-foreground leading-tight">
              {profile?.name || 'KeepsDSA'}
            </span>
            {profile?.name && <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Connected</span>}
          </div>
        </div>
        <button onClick={handleLogout} className="text-muted-foreground hover:text-primary hover:bg-accent p-2 rounded-lg transition-colors border border-transparent hover:border-border/30" title="Disconnect">
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 flex flex-col items-center justify-center text-center relative z-10">
        <div className="relative mb-6 group">
          <div className="absolute inset-0 bg-[#00b87a]/20 blur-xl rounded-full group-hover:bg-[#00b87a]/30 transition-colors"></div>
          <div className="w-20 h-20 bg-card border border-border/40 rounded-full flex items-center justify-center relative shadow-xl shadow-[#00b87a]/10">
            <CloudCog className="w-9 h-9 text-[#00b87a]" />
          </div>
        </div>
        <h2 className="text-[20px] font-bold mb-3 font-heading text-foreground">Ready to Sync</h2>
        <p className="text-muted-foreground text-[13px] max-w-[260px] mx-auto leading-relaxed">
          Open any LeetCode problem page and click the floating <strong className="text-foreground font-semibold px-1.5 py-0.5 rounded bg-accent border border-border/30 shadow-sm mx-0.5">Save to KeepsDSA</strong> button.
        </p>
      </div>
      
      {/* Footer */}
      <div className="px-5 py-4 border-t border-border/40 bg-card/30 flex justify-between items-center text-[11px] text-muted-foreground font-medium uppercase tracking-wider relative z-10">
        <span className="opacity-70">v1.0.0</span>
        <a href={`${WEB_URL}/explore`} target="_blank" rel="noreferrer" className="text-primary hover:text-primary/80 transition-colors flex items-center gap-1 group">
          Open Dashboard
          <span className="material-symbols-outlined text-[14px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
        </a>
      </div>
    </div>
  );
}
