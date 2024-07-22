import React from 'react';
import type { RegisterOptions } from 'react-hook-form';
import { useFormContext } from 'react-hook-form';
import type { IconType } from 'react-icons';
import cx from 'clsx';

type options_getter = (x: void) => Map<string, string | number> | Promise<Map<string, string | number>>;
type options_list = (string | number)[] | Record<string, string | number>;

type Props = {
  children?: React.ReactNode;
  className?: string;
  name: string;
  label?: string;
  placeholder?: string;
  description?: React.ReactNode;
  RightIcon?: IconType;
  registerOptions?: RegisterOptions;
  options: options_getter | options_list;
} & React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select: React.FC<Props> = ({
  className,
  name,
  label,
  placeholder,
  description,
  options: opts,
  registerOptions,
  children,
  ...otherProps
}: Props) => {
  const { register, formState } = useFormContext();

  const errors = formState.errors[name];
  const errorContent = errors?.types ? Object.values(errors.types).map((text, index) => <small key={index}>{text}</small>) : null;

  const options = React.useMemo(() => {
    const result: Record<string, string | number> = {};
    if (Array.isArray(opts)) for (const value of opts) result[value] = value;
    else Object.assign(result, opts);
    return result;
  }, [opts]);

  return (
    <div className="relative flex flex-col" data-testid="control-input">
      {label && (
        <label className="text-grey-label ml-3 block" htmlFor={`select-${name}`}>
          {label}
        </label>
      )}
      <select
        id={`select-${name}`}
        className={cx(
          // hack: use invalid:* to style the placeholder
          'focus:border-blue border-grey-border relative mt-1 w-full rounded-full border px-3 py-2 invalid:text-slate-500 disabled:cursor-not-allowed disabled:bg-gray-200',
          errorContent && 'border-red-dark',
          className,
        )}
        data-testid="select"
        defaultValue=""
        required={true} /* hack: use the :invalid selector to style placeholder */
        {...register(name, registerOptions)}
        {...otherProps}
      >
        {placeholder && (
          <option disabled={!!registerOptions?.required} value="">
            {placeholder}
          </option>
        )}
        {Object.entries(options).map(([key, value]) => (
          <option key={key} value={key}>
            {value as string}
          </option>
        ))}
      </select>
      {description && <span>{description}</span>}
      {errorContent && (
        <div data-testid="control-errors" className="red flex flex-col gap-1">
          {errorContent}
        </div>
      )}
      {children}
    </div>
  );
};
