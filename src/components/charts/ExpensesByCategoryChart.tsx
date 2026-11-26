import { useEffect, useRef } from 'react';
import { ArcElement, Chart, DoughnutController, Tooltip } from 'chart.js';
import { PieChart } from 'lucide-react';
import type { CategoryTotal } from '@/types';
import { formatCurrency } from '@/utils/format';
import { EmptyState } from '@/components/common/EmptyState';

// Solo se registran los módulos usados (tree-shaking de Chart.js)
Chart.register(DoughnutController, ArcElement, Tooltip);

interface ExpensesByCategoryChartProps {
  data: readonly CategoryTotal[];
  currency: string;
}

export function ExpensesByCategoryChart({ data, currency }: ExpensesByCategoryChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart<'doughnut'> | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;

    chartRef.current?.destroy();
    chartRef.current = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: data.map((d) => d.name),
        datasets: [
          {
            data: data.map((d) => d.total),
            backgroundColor: data.map((d) => d.color),
            borderWidth: 2,
            borderColor: '#ffffff',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '68%',
        plugins: {
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.label}: ${formatCurrency(ctx.parsed, currency)}`,
            },
          },
        },
      },
    });

    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [data, currency]);

  if (data.length === 0) {
    return (
      <EmptyState
        icon={PieChart}
        title="Aún no hay egresos"
        description="Cuando registres gastos, verás aquí su distribución por categoría."
      />
    );
  }

  const total = data.reduce((sum, d) => sum + d.total, 0);

  return (
    <div className="grid items-center gap-4 sm:grid-cols-2">
      <div className="relative mx-auto h-48 w-48">
        <canvas ref={canvasRef} role="img" aria-label="Gráfica de gastos por categoría" />
      </div>
      <ul className="space-y-2">
        {data.map((item) => (
          <li key={item.categoryId} className="flex items-center gap-2 text-sm">
            <span
              className="h-3 w-3 shrink-0 rounded-full"
              style={{ backgroundColor: item.color }}
              aria-hidden
            />
            <span className="flex-1 truncate text-slate-700">{item.name}</span>
            <span className="font-medium text-slate-900">{formatCurrency(item.total, currency)}</span>
            <span className="w-10 text-right text-xs text-slate-500">
              {Math.round((item.total / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
