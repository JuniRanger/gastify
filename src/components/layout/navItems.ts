import { ArrowLeftRight, LayoutDashboard, Settings, type LucideIcon } from 'lucide-react';
import type { Route } from '@/hooks/useHashRoute';

export interface NavItem {
  route: Route;
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { route: '/', label: 'Resumen', icon: LayoutDashboard },
  { route: '/transactions', label: 'Movimientos', icon: ArrowLeftRight },
  { route: '/settings', label: 'Ajustes', icon: Settings },
];
