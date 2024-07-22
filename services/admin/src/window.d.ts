/* eslint-disable @typescript-eslint/consistent-type-definitions */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { RowData, TData, TValue } from '@tanstack/react-table';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    className?: string;
  }
}
