import AppLayoutClient from '@/components/layout/AppLayoutClient';

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppLayoutClient>
      {children}
    </AppLayoutClient>
  );
}
