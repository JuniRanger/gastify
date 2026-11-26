import { AppInfo } from '@/components/settings/AppInfo';
import { CurrencySettings } from '@/components/settings/CurrencySettings';
import { NotificationSettings } from '@/components/settings/NotificationSettings';
import { PageHeader } from '@/components/layout/PageHeader';

export function Settings() {
  return (
    <>
      <PageHeader title="Configuración" subtitle="Preferencias de la aplicación" />
      <div className="space-y-4">
        <CurrencySettings />
        <NotificationSettings />
        <AppInfo />
      </div>
    </>
  );
}
