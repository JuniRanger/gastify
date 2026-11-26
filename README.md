# Gastify

PWA de control inteligente de gastos personales. Registra ingresos y egresos, consulta tu balance y visualiza estadísticas; todo se guarda en el dispositivo y funciona sin conexión.

> **Estado del proyecto:** plantilla generada **sin instalar dependencias, sin compilar y sin ejecutar**. El código está escrito completo pero **no ha sido probado**. Ver [Estado de implementación](#estado-de-implementación) antes de entregarlo.

## Objetivo

Construir una Aplicación Web Progresiva que cumpla los requisitos de una evaluación académica de PWA: instalable, con service worker y acceso offline, almacenamiento local en IndexedDB, consumo de una API REST externa y uso de al menos dos capacidades del dispositivo (Web Share API y Notifications API).

## Problemática

Llevar un control de gastos suele requerir apps que dependen de internet, cuentas de usuario o servidores. Gastify guarda los datos localmente, no necesita registro y sigue funcionando sin conexión.

## Funcionalidades

- Registrar, consultar, editar y eliminar movimientos (ingresos y egresos).
- Clasificación por categorías (12 precargadas).
- Balance, total de ingresos y total de egresos.
- Gráfica de gastos por categoría (dona, Chart.js).
- Filtros por tipo y categoría, y búsqueda por texto.
- Consulta de tipo de cambio (API REST externa) y conversión del balance.
- Compartir resumen financiero (Web Share API con fallback).
- Notificaciones locales (Notifications API).
- Instalación como app y funcionamiento offline.
- Interfaz responsive: navegación inferior en móvil, sidebar en escritorio.

## Stack tecnológico

| Tecnología | Uso |
| --- | --- |
| React 18 + Vite 5 + TypeScript (strict) | Interfaz y build |
| Tailwind CSS 3 | Estilos |
| Dexie.js 4 (IndexedDB) | Persistencia local |
| Chart.js 4 | Gráficas |
| vite-plugin-pwa (Workbox) | Manifest y service worker |
| Lucide React | Iconografía |

No se usa router externo (se emplea un enrutador mínimo por hash) ni librería de estado global.

## Arquitectura

Capas con dependencias en un solo sentido: `pages → components / hooks → services → db`.

- **services/**: lógica sin React (IndexedDB, API de divisas, notificaciones, compartir). Cada servicio es independiente.
- **hooks/**: puente entre servicios y UI (`useLiveQuery` suscribe a Dexie y re-renderiza al cambiar los datos).
- **components/**: componentes reutilizables por dominio.
- **pages/**: composición de pantallas.
- **utils/**: validación, formato y manejo centralizado de errores (`AppError`, `handleError`).

## Estructura de carpetas

```text
gastify/
├── public/
│   ├── icons/                # icon-192, icon-512, icon-maskable-512, apple-touch-icon
│   ├── favicon.ico
│   └── offline.html          # página de fallback offline
├── src/
│   ├── assets/logo.svg
│   ├── components/
│   │   ├── layout/           # AppLayout, Sidebar, BottomNav, PageHeader
│   │   ├── dashboard/        # SummaryCards, ShareSummaryButton
│   │   ├── transactions/     # Form, FormModal, List, Item, Filters
│   │   ├── charts/           # ExpensesByCategoryChart
│   │   ├── settings/         # CurrencySettings, NotificationSettings, AppInfo
│   │   └── common/           # Button, Card, Modal, Field, Toast, EmptyState...
│   ├── pages/                # Dashboard, Transactions, Settings
│   ├── hooks/
│   ├── services/
│   │   ├── database/         # db, transaction/category/stats/settings services
│   │   ├── currency/         # exchangeRateService
│   │   ├── notifications/    # notificationService
│   │   └── sharing/          # shareService
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
└── .gitignore
```

Ajustes respecto a la estructura solicitada: se añadieron `components/settings/`, `tailwind.config.js` (necesario para Tailwind 3) y `offline.html`.

## Modelo de datos

```ts
interface Transaction {
  id: string;            // UUID
  description: string;
  amount: number;        // siempre positivo; el signo lo da `type`
  type: 'income' | 'expense';
  category: string;      // id de Category
  date: string;          // YYYY-MM-DD (fecha local)
  notes?: string;
  createdAt: number;     // epoch ms
  updatedAt: number;
}

interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;         // hex
  icon: string;          // clave en utils/icons.ts
}
```

Base de datos IndexedDB `gastify` (versión 1): `transactions` (índices: type, category, date, createdAt), `categories` (type) y `settings` (clave `app`). Las categorías por defecto se insertan en la creación de la base. No se usa `localStorage`.

## Integraciones

- **API REST externa:** [Open Exchange Rate API](https://www.exchangerate-api.com/docs/free) (`GET https://open.er-api.com/v6/latest/{BASE}`), sin API key. Manejo de errores de red/HTTP/formato y estados de carga en `useExchangeRate`. **Verifica sus términos de uso (incluyen atribución) y que el endpoint siga vigente antes de desplegar.** Si prefieres otra API, solo hay que cambiar `exchangeRateService.ts`.
- **Web Share API:** comparte el resumen; si no existe, copia al portapapeles; si tampoco, muestra el texto para copiarlo a mano.
- **Notifications API:** solicitud de permiso desde un gesto del usuario, notificación de prueba y aviso opcional al registrar movimientos. Maneja navegadores no compatibles y permiso denegado.

## Requisitos para instalación

- Node.js 18 o superior (recomendado 20 LTS) y npm.

## Instrucciones de ejecución (para cuando se implemente)

```bash
npm install
npm run dev        # desarrollo (el service worker está desactivado por defecto)
npm run typecheck  # verificación de tipos
npm run build      # compila y genera el service worker
npm run preview    # sirve la build; aquí se prueba la PWA / offline
```

Para probar el service worker en desarrollo, cambia `devOptions.enabled` a `true` en `vite.config.ts`.

## Consideraciones offline

- El *app shell* (JS, CSS, HTML, iconos) se precachea con Workbox; las navegaciones sin red devuelven `index.html`.
- Los datos viven en IndexedDB, así que consultar, crear, editar y eliminar movimientos funciona sin conexión.
- Los tipos de cambio usan estrategia *NetworkFirst* con caché de respaldo (24 h); sin red ni caché se muestra un mensaje de error.
- `registerType: 'prompt'`: la app avisa cuando hay una versión nueva y el usuario decide actualizar.
- `public/offline.html` se precachea y queda disponible como página independiente; **no está conectada como fallback de navegación** (el fallback configurado es `index.html`). Ver pendientes.

## Requisitos para despliegue HTTPS

- Los service workers, la instalación y las notificaciones requieren **HTTPS** (se exceptúa `localhost`).
- Servir `dist/` como sitio estático con el HTTPS del proveedor (Netlify, Vercel, GitHub Pages, Cloudflare Pages, etc.).
- Al usar enrutado por hash no se necesitan reglas de *rewrite* para las rutas.
- Si se despliega en una subruta (p. ej. GitHub Pages `/gastify/`), configurar `base` en `vite.config.ts` y ajustar `start_url`/`scope` del manifest.
- Verificar con Lighthouse (categoría PWA) y con DevTools → Application.

## Estado de implementación

**No se ejecutó `npm install`, `npm run dev`, `npm run build` ni pruebas.** Nada de lo siguiente ha sido compilado ni probado en navegador.

| Área | Estado |
| --- | --- |
| Modelos TypeScript, validaciones, manejo de errores | Implementación escrita |
| Dexie / servicios de movimientos, categorías, estadísticas, ajustes | Implementación escrita |
| Servicio de tipos de cambio + hook con estados | Implementación escrita |
| Servicios de compartir y notificaciones | Implementación escrita |
| Componentes, páginas, layout responsive, gráfica | Implementación escrita |
| Configuración Vite / PWA / Tailwind / TypeScript | Configuración escrita; requiere verificación al compilar |
| Iconos (PNG/ICO) | Generados, diseño provisional |
| `offline.html` | Escrito, **scaffolding** (no enlazado como fallback) |

### Pendientes y configuración posterior

1. Ejecutar `npm install` y corregir posibles errores de tipos o versiones al compilar (las versiones de `package.json` no se verificaron contra el registro).
2. Confirmar el comportamiento del service worker con `npm run build && npm run preview` (instalación, modo avión).
3. Decidir si `offline.html` se usa como fallback real (requiere un manejador de navegación personalizado, p. ej. `injectManifest`) o se elimina.
4. Revisar el diseño del icono y reemplazarlo si se desea una identidad propia.
5. Verificar términos y disponibilidad de la API de tipos de cambio.
6. Sin pruebas automatizadas incluidas.
7. Limitaciones conocidas: sin respaldo/exportación de datos; cambiar la moneda base no convierte importes guardados; gráfica y balance cubren todo el historial (sin filtro por periodo).
