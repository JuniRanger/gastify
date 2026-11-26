import type { Route } from '@/hooks/useHashRoute';
import { NAV_ITEMS } from './navItems';

interface BottomNavProps {
  current: Route;
  onNavigate: (route: Route) => void;
}

/** Navegación inferior para móvil (oculta en md+). */
export function BottomNav({ current, onNavigate }: BottomNavProps) {
  return (
    <nav
      aria-label="Principal"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <ul className="grid grid-cols-3">
        {NAV_ITEMS.map(({ route, label, icon: Icon }) => {
          const active = current === route;
          return (
            <li key={route}>
              <button
                type="button"
                onClick={() => onNavigate(route)}
                aria-current={active ? 'page' : undefined}
                className={`flex w-full flex-col items-center gap-1 py-2.5 text-xs font-medium ${
                  active ? 'text-brand-700' : 'text-slate-500'
                }`}
              >
                <Icon className="h-5 w-5" aria-hidden />
                {label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
