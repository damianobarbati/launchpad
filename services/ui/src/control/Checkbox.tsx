import React from 'react';
import { Controller } from 'react-hook-form';
import { useFormContext } from 'react-hook-form';
import cx from 'clsx';

type Props = {
  children?: React.ReactNode;
  className?: string;
  name: string;
  label?: string;
  indeterminate?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const Checkbox: React.FC<Props> = ({ className, label, name, indeterminate = false }) => {
  const { control } = useFormContext();

  const ref = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (!ref.current) return;
    ref.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange } }) => (
        <div className={cx('relative ml-3 flex w-max flex-col', className)} data-testid="control-input">
          <div className="flex items-center justify-center gap-3">
            <input
              ref={ref}
              id={`input-${name}`}
              type={'checkbox'}
              className="border-grey-border peer relative size-5 shrink-0 appearance-none rounded-sm border bg-white disabled:border-gray-600 disabled:bg-green-600"
              onChange={(event) => onChange(event.target.checked)}
              checked={!!value}
            />
            <svg
              className="pointer-events-none absolute left-[2px] top-[2px] hidden size-4 peer-checked:block"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {label && (
              <label className="text-grey-label block" htmlFor={`input-${name}`}>
                {label}
              </label>
            )}
          </div>
        </div>
      )}
    />
  );
};
