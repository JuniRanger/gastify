import { useState } from 'react';
import { Share2 } from 'lucide-react';
import type { CategoryTotal, Summary } from '@/types';
import { buildSummaryText, shareSummary } from '@/services/sharing/shareService';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { inputClass } from '@/components/common/Field';
import { useToast } from '@/components/common/ToastProvider';

interface ShareSummaryButtonProps {
  summary: Summary;
  topExpenses: readonly CategoryTotal[];
  currency: string;
}

export function ShareSummaryButton({ summary, topExpenses, currency }: ShareSummaryButtonProps) {
  const { showToast } = useToast();
  const [fallbackText, setFallbackText] = useState<string | null>(null);

  const handleShare = async () => {
    const text = buildSummaryText(summary, currency, topExpenses);
    const result = await shareSummary(text);

    if (result === 'copied') showToast('Resumen copiado al portapapeles.', 'success');
    else if (result === 'unavailable') setFallbackText(text); // último recurso: copiar a mano
  };

  return (
    <>
      <Button variant="secondary" icon={<Share2 className="h-4 w-4" aria-hidden />} onClick={handleShare}>
        Compartir
      </Button>

      <Modal open={fallbackText !== null} title="Copia tu resumen" onClose={() => setFallbackText(null)}>
        <p className="mb-2 text-sm text-slate-600">
          Tu navegador no permite compartir ni copiar automáticamente. Selecciona y copia el texto:
        </p>
        <textarea
          readOnly
          rows={7}
          value={fallbackText ?? ''}
          onFocus={(e) => e.currentTarget.select()}
          className={inputClass}
          aria-label="Resumen financiero"
        />
      </Modal>
    </>
  );
}
