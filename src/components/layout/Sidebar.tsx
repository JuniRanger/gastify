import logoUrl from '@/assets/logo.svg';
import type { Route } from '@/hooks/useHashRoute';
import { APP_NAME } from '@/utils/constants';
import { NAV_ITEMS } from './navItems';

interface SidebarProps {
  current: Route;
  onNavigate: (route: Route) => void;
}

/** Navegación lateral para pantallas md+. */
export function Sidebar({ current, onNavigate }: SidebarProps) {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white p-4 md:flex">
      <div className="mb-8 flex items-center gap-3 px-2">
        <img src={logoUrl} alt="" className="h-9 w-9" />
        <span className="text-lg font-bold text-slate-900">{APP_NAME}</span>
      </div>
      <nav aria-label="Principal" className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ route, label, icon: Icon }) => {
          const active = current === route;
          return (
            <button
              key={route}
              type="button"
              onClick={() => onNavigate(route)}
              aria-current={active ? 'page' : undefined}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                active ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon className="h-5 w-5" aria-hidden />
              {label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
