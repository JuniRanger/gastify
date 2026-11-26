import type { ReactNode } from 'react';
import type { Route } from '@/hooks/useHashRoute';
import { OfflineBanner } from '@/components/common/OfflineBanner';
import { BottomNav } from './BottomNav';
import { Sidebar } from './Sidebar';

interface AppLayoutProps {
  route: Route;
  onNavigate: (route: Route) => void;
  children: ReactNode;
}

export function AppLayout({ route, onNavigate, children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar current={route} onNavigate={onNavigate} />
      <div className="flex min-w-0 flex-1 flex-col">
        <OfflineBanner />
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-28 pt-6 md:px-8 md:pb-10">
          {children}
        </main>
      </div>
      <BottomNav current={route} onNavigate={onNavigate} />
    </div>
  );
}
