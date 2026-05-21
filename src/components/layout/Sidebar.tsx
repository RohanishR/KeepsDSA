import Link from 'next/link';

export default function Sidebar() {
  return (
    <nav className="hidden md:flex flex-col fixed left-0 top-0 h-full w-[260px] z-40 bg-surface/70 backdrop-blur-xl border-r border-outline-variant/10 shadow-[0_0_20px_rgba(188,195,255,0.05)] py-gutter">
      <div className="px-gutter mb-8">
        <h1 className="font-display-lg text-[32px] font-bold text-primary tracking-tighter leading-none mt-2">KeepsDSA</h1>
        <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">v1.0.0-beta</p>
      </div>
      <div className="px-gutter mb-6">
        <button className="w-full bg-gradient-to-r from-primary to-secondary text-on-primary font-label-sm text-label-sm py-2 rounded shadow-[0_0_15px_rgba(188,195,255,0.3)] hover:shadow-[0_0_20px_rgba(188,195,255,0.5)] transition-all flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-[16px]">add</span>
          New Problem
        </button>
      </div>
      <ul className="flex flex-col flex-grow">
        <li><Link className="flex items-center gap-stack-gap-md px-4 py-3 bg-primary-container/20 text-primary border-r-2 border-primary scale-[0.98] duration-150" href="/dashboard"><span className="material-symbols-outlined">dashboard</span><span className="font-label-sm text-label-sm">Dashboard</span></Link></li>
        <li><Link className="flex items-center gap-stack-gap-md px-4 py-3 text-on-surface-variant hover:text-on-surface transition-colors hover:bg-surface-container-high transition-all duration-200" href="/explore"><span className="material-symbols-outlined">database</span><span className="font-label-sm text-label-sm">Explorer</span></Link></li>
        <li><Link className="flex items-center gap-stack-gap-md px-4 py-3 text-on-surface-variant hover:text-on-surface transition-colors hover:bg-surface-container-high transition-all duration-200" href="/notes"><span className="material-symbols-outlined">edit_note</span><span className="font-label-sm text-label-sm">Notes</span></Link></li>
        <li><Link className="flex items-center gap-stack-gap-md px-4 py-3 text-on-surface-variant hover:text-on-surface transition-colors hover:bg-surface-container-high transition-all duration-200" href="/revision"><span className="material-symbols-outlined">history_edu</span><span className="font-label-sm text-label-sm">Revision</span></Link></li>
        <li><Link className="flex items-center gap-stack-gap-md px-4 py-3 text-on-surface-variant hover:text-on-surface transition-colors hover:bg-surface-container-high transition-all duration-200" href="/profile"><span className="material-symbols-outlined">settings</span><span className="font-label-sm text-label-sm">Settings</span></Link></li>
      </ul>
    </nav>
  );
}
