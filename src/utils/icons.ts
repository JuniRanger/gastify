import {
  Banknote,
  Car,
  CircleHelp,
  Gamepad2,
  GraduationCap,
  HeartPulse,
  Home,
  Laptop,
  MoreHorizontal,
  ShoppingBag,
  TrendingUp,
  Utensils,
  Wallet,
  type LucideIcon,
} from 'lucide-react';

/** Las categorías guardan una clave de texto; aquí se resuelve al componente. */
const ICONS: Record<string, LucideIcon> = {
  utensils: Utensils,
  car: Car,
  home: Home,
  heart: HeartPulse,
  gamepad: Gamepad2,
  graduation: GraduationCap,
  shopping: ShoppingBag,
  more: MoreHorizontal,
  wallet: Wallet,
  laptop: Laptop,
  trending: TrendingUp,
  banknote: Banknote,
};

export function getCategoryIcon(key: string): LucideIcon {
  return ICONS[key] ?? CircleHelp;
}
