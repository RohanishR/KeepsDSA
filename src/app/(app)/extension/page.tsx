'use client';

import React, { useState, useEffect } from 'react';
import { Download, Code2, CheckCircle2, Copy } from 'lucide-react';

export default function ExtensionPage() {
  const [token, setToken] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch('/api/extension/token')
      .then(res => res.json())
      .then(data => {
        if (data.token) setToken(data.token);
      });
  }, []);

  const generateToken = async () => {
    const res = await fetch('/api/extension/token', { method: 'POST' });
    const data = await res.json();
    if (data.token) setToken(data.token);
  };

  const copyToken = () => {
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
          <Code2 className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">KeepsDSA Chrome Extension</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Sync your LeetCode problems, notes, and accepted solutions directly into your vault with a single click.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Step 1: Download */}
        <div className="bg-card border border-border rounded-xl p-8 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Download className="w-32 h-32" />
          </div>
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">1</span>
            Download Extension
          </h2>
          <p className="text-muted-foreground mb-6">
            Download the extension package and load it manually into Chrome.
          </p>
          
          <a href="/keepsdsa-extension.zip" download className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors w-full">
            <Download className="w-5 h-5" />
            Download .zip Package
          </a>

          <div className="mt-8 space-y-3 text-sm text-muted-foreground">
            <h3 className="font-semibold text-foreground">How to install:</h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Extract the downloaded <code>.zip</code> file.</li>
              <li>Open Chrome and navigate to <code>chrome://extensions</code></li>
              <li>Enable <strong>"Developer mode"</strong> in the top right.</li>
              <li>Click <strong>"Load unpacked"</strong> and select the extracted folder.</li>
            </ol>
          </div>
        </div>

        {/* Step 2: Connect */}
        <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">2</span>
            Connect Account
          </h2>
          <p className="text-muted-foreground mb-6">
            Generate your personal Extension API Key to securely sync data to your account.
          </p>
          
          {token ? (
            <div className="bg-background border border-border rounded-lg p-4 mb-4">
              <label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2 block">Your Extension API Key</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  readOnly 
                  value={token} 
                  className="bg-transparent border-none flex-1 text-sm font-mono focus:outline-none"
                />
                <button onClick={copyToken} className="p-2 bg-muted hover:bg-accent rounded-md transition-colors text-foreground">
                  {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ) : (
            <button onClick={generateToken} className="bg-primary/10 text-primary font-semibold px-6 py-3 rounded-lg hover:bg-primary/20 transition-colors w-full mb-4">
              Generate API Key
            </button>
          )}

          <div className="text-sm text-muted-foreground">
            <p>Click the extension icon in your browser toolbar and paste this key to authenticate.</p>
          </div>
        </div>
      </div>
      
      <div className="bg-muted/30 border border-border rounded-xl p-6 text-center">
        <h3 className="font-semibold mb-2">Ready to go!</h3>
        <p className="text-sm text-muted-foreground">
          Head over to any LeetCode problem or submission page and look for the floating <strong>"Save to KeepsDSA"</strong> button.
        </p>
      </div>
    </div>
  );
}
