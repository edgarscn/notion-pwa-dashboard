import { NumberFormat } from '../types';

export function formatNumber(val: any, format?: NumberFormat): string {
  if (val === null || val === undefined || val === '') return '';
  const num = Number(val);
  if (isNaN(num)) return String(val);

  switch (format) {
    case 'currency_usd':
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);

    case 'currency_brl':
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num);

    case 'percent':
      return `${Math.round(num * 100) / 100}%`;

    case 'number':
    default:
      return new Intl.NumberFormat('pt-BR').format(num);
  }
}

export function formatDate(val: string | undefined): string {
  if (!val) return '';
  try {
    const d = new Date(val);
    if (isNaN(d.getTime())) return val;
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch (err) {
    return val;
  }
}

export function formatDateTime(val: string | undefined): string {
  if (!val) return '';
  try {
    const d = new Date(val);
    if (isNaN(d.getTime())) return val;
    return d.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (err) {
    return val;
  }
}
