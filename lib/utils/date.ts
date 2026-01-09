import { formatDistanceToNow, format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export function formatDate(date: string | Date, formatStr: string = 'PPP'): string {
  return format(new Date(date), formatStr, { locale: zhCN });
}

export function formatRelativeTime(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { locale: zhCN, addSuffix: true });
}
