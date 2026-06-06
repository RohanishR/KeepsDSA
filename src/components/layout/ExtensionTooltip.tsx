import React from 'react';

const ExtensionTooltip = () => {
  return (
    <div className="relative inline-block group z-50">
      <button className="relative px-4 py-2 text-xs font-semibold text-white bg-indigo-600/90 rounded-xl hover:bg-indigo-700/90 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-xl group-hover:opacity-75 transition-opacity pointer-events-none" />
        <span className="relative flex items-center gap-2">
          <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" className="w-4 h-4">
            <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
          </svg>
          Info
        </span>
      </button>
      <div className="absolute invisible opacity-0 group-hover:visible group-hover:opacity-100 top-full right-0 mt-3 w-80 transition-all duration-300 ease-out transform group-hover:translate-y-0 -translate-y-2 origin-top-right">
        <div className="relative p-4 bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-md rounded-2xl border border-white/10 shadow-[0_0_30px_rgba(79,70,229,0.15)] text-left">
          <div className="flex items-start gap-3 mb-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500/20 shrink-0 mt-0.5">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-indigo-400">
                <path clipRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" fillRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-white pt-1">Important Information</h3>
          </div>
          <div className="space-y-2 pl-2">
            <ul className="text-[13px] text-gray-300 space-y-2 list-disc pl-4 marker:text-indigo-500">
              <li>Download ChromeExtension to Import problems from LeetCode</li>
            </ul>
          </div>
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 blur-xl opacity-50 pointer-events-none" />
          <div className="absolute -top-1.5 right-12 w-3 h-3 bg-gradient-to-br from-gray-900/95 to-gray-800/95 rotate-45 border-l border-t border-white/10" />
        </div>
      </div>
    </div>
  );
}

export default ExtensionTooltip;
