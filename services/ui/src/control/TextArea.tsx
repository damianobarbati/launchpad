import React from 'react';
import type { RegisterOptions } from 'react-hook-form';
import { useFormContext } from 'react-hook-form';
import cx from 'clsx';
import { debounce } from 'lodash-es';

type Props = {
  children?: React.ReactNode;
  className?: string;
  name: string;
  label?: string;
  placeholder?: string;
  description?: React.ReactNode;
  registerOptions?: RegisterOptions;
  handleErrorMessages?: boolean;
  debouncedAutoSubmitForm?: string;
  debouncedAutoSubmitTimeout?: number;
  rows?: number;
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';
} & React.InputHTMLAttributes<HTMLTextAreaElement>;

export const TextArea: React.FC<Props> = ({
  children,
  className,
  name,
  label,
  description,
  registerOptions = {},
  handleErrorMessages = true,
  debouncedAutoSubmitForm,
  debouncedAutoSubmitTimeout,
  rows,
  resize = 'none',
  ...otherProps
}) => {
  const { register, formState } = useFormContext();

  const debouncedOnChange = React.useMemo(
    () =>
      debounce(() => {
        if (!debouncedAutoSubmitForm || !debouncedAutoSubmitTimeout) return;
        const form = document.querySelector(debouncedAutoSubmitForm) as HTMLFormElement;
        if (!form) return console.warn(`Input: form with selector ${debouncedAutoSubmitForm} could not be found.`);
        form.requestSubmit();
      }, debouncedAutoSubmitTimeout),
    [debouncedAutoSubmitForm, debouncedAutoSubmitTimeout],
  );

  const errors = formState.errors[name];
  const errorContent = errors?.types ? Object.values(errors.types).map((text, index) => <small key={index}>{text}</small>) : null;

  return (
    <div className={cx('relative flex min-w-max flex-col', className)} data-testid="control-input">
      {label && (
        <label className="text-grey-label caption mb-2 ml-4 block" htmlFor={`input-${name}`}>
          {label}
        </label>
      )}
      <textarea
        id={`input-${name}`}
        rows={rows}
        className={cx(
          'focus:border-blue border-grey-border relative min-h-[44px] w-max min-w-full resize-none rounded-2xl border py-2 pl-5 text-black disabled:cursor-not-allowed',
          resize === 'none' && 'resize-none',
          resize === 'both' && 'resize',
          resize === 'horizontal' && 'resize-x',
          resize === 'vertical' && 'resize-y',
          errorContent && 'border-red-dark',
          otherProps.disabled && 'bg-gray-100',
        )}
        data-testid="textarea"
        {...register(name, { onChange: debouncedOnChange, ...registerOptions })}
        {...otherProps}
      />

      {description && <span className="text-grey ml-3">{description}</span>}
      {handleErrorMessages && errorContent && (
        <div data-testid="control-errors" className="red ml-3 flex flex-col gap-1">
          {errorContent}
        </div>
      )}
      <div className="red ml-3 mt-1">{children}</div>
    </div>
  );
};
