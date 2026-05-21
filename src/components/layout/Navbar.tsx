import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="fixed top-0 right-0 left-0 md:left-[260px] h-16 z-30 bg-surface/80 backdrop-blur-md border-b border-outline-variant/10 flex justify-between items-center px-gutter w-full md:w-auto">
      <div className="md:hidden font-headline-md text-headline-md font-bold text-primary">KeepsDSA</div>
      <nav className="hidden md:flex gap-6 h-full items-center">
        <Link className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer font-label-sm text-label-sm h-full flex items-center" href="/explore">Problems</Link>
        <Link className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer font-label-sm text-label-sm h-full flex items-center" href="/dashboard">Dashboard</Link>
      </nav>
      <div className="flex items-center gap-4 ml-auto">
        <div className="hidden lg:flex items-center gap-2">
          <button className="text-on-surface-variant hover:text-primary transition-colors"><span className="material-symbols-outlined">notifications</span></button>
        </div>
        <div className="w-8 h-8 rounded-full bg-surface-variant overflow-hidden border border-outline-variant/50 ml-2">
          {/* Use a placeholder image or Next/Image */}
          <img alt="User profile" className="w-full h-full object-cover" src="https://ui-avatars.com/api/?name=User&background=3196e8&color=fff"/>
        </div>
      </div>
    </header>
  );
}
