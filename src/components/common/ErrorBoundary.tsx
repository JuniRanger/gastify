import { Component, type ErrorInfo, type ReactNode } from 'react';
import { handleError } from '@/utils/errors';
import { Button } from './Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/** Último recurso: evita pantalla en blanco si un componente lanza durante el render. */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    handleError(error, `ErrorBoundary${info.componentStack ?? ''}`);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 p-6 text-center">
        <h1 className="text-lg font-semibold text-slate-900">Algo salió mal</h1>
        <p className="max-w-sm text-sm text-slate-600">
          Ocurrió un error inesperado. Tus datos guardados no se han perdido.
        </p>
        <Button onClick={() => window.location.reload()}>Recargar</Button>
      </div>
    );
  }
}
