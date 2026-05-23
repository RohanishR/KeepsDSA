import Footer from '@/components/layout/Footer';
import Link from 'next/link';

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <header className="fixed top-0 right-0 left-0 h-16 z-30 bg-background/80 backdrop-blur-md border-b border-border/10 flex justify-between items-center px-4 md:px-8 w-full">
        <div className="font-heading text-headline-md font-bold text-primary">KeepsDSA</div>
        <nav className="flex gap-6 h-full items-center">
          <Link className="px-4 py-1.5 border border-border rounded font-subheading text-[12px] uppercase tracking-wider text-label-sm text-foreground hover:bg-muted/80 transition-colors" href="/login">Login</Link>
          <Link className="px-4 py-1.5 bg-primary/20 text-primary rounded font-subheading text-[12px] uppercase tracking-wider text-label-sm hover:opacity-90 transition-opacity" href="/register">Sign Up</Link>
        </nav>
      </header>
      <main className="flex-1 mt-16 w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
}
