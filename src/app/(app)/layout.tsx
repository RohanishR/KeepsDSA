import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-[260px] min-h-screen relative">
        <Navbar />
        <main className="flex-1 p-4 md:p-8 mt-16 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
