import React from 'react';
import type { RegisterOptions } from 'react-hook-form';
import { useFormContext } from 'react-hook-form';
import type { IconType } from 'react-icons';
import { IEye, IEyeOff } from '@ui/component/Icons';
import cx from 'clsx';
import { debounce } from 'lodash-es';

type Props = {
  children?: React.ReactNode;
  className?: string;
  name: string;
  label?: string;
  placeholder?: string;
  description?: React.ReactNode;
  RightIcon?: IconType;
  registerOptions?: RegisterOptions;
  handleErrorMessages?: boolean;
  debouncedAutoSubmitForm?: string;
  debouncedAutoSubmitTimeout?: number;
} & React.InputHTMLAttributes<HTMLInputElement>;

const stringToDate = (value: string): string => {
  try {
    return new window.Date(value).toISOString().replace(/\.[0-9]{3}/, '');
  } catch {
    return '';
  }
};

const stringToNumber = (value: string): number => {
  try {
    return Number.parseFloat(value);
  } catch {
    return 0;
  }
};

export const Input: React.FC<Props> = ({
  children,
  className,
  name,
  label,
  description,
  RightIcon,
  registerOptions = {},
  handleErrorMessages = true,
  debouncedAutoSubmitForm,
  debouncedAutoSubmitTimeout,
  ...otherProps
}) => {
  const { register, formState } = useFormContext();
  const [type, setType] = React.useState(otherProps.type);

  const EyeIcon = React.useMemo(() => (type === 'password' ? IEye : IEyeOff), [type]);

  React.useEffect(() => {
    setType(otherProps.type);
  }, [otherProps.type]);

  const debouncedOnChange = React.useMemo(() => {
    if (!debouncedAutoSubmitForm || !debouncedAutoSubmitTimeout) return;
    return debounce(() => {
      const form = document.querySelector(debouncedAutoSubmitForm) as HTMLFormElement;
      if (!form) return console.warn(`Input: form with selector ${debouncedAutoSubmitForm} could not be found.`);
      form.requestSubmit();
    }, debouncedAutoSubmitTimeout);
  }, [debouncedAutoSubmitForm, debouncedAutoSubmitTimeout]);

  const setValueAs = React.useMemo(() => {
    if (registerOptions.setValueAs) return registerOptions.setValueAs;
    if (otherProps.type === 'datetime-local') return stringToDate;
    if (otherProps.type === 'date') return stringToDate;
    if (otherProps.type === 'number') return stringToNumber;
    return (value: any) => value;
  }, [otherProps.type, registerOptions.setValueAs]);

  const errors = formState.errors[name];
  const errorContent = errors?.types ? Object.values(errors.types).map((text, index) => <small key={index}>{text}</small>) : null;

  const onToggleShowPassword = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setType((prevType) => (prevType === 'password' ? 'text' : 'password'));
  };

  return (
    <div className={cx('relative flex min-w-max flex-col justify-center', className)} data-testid="control-input">
      {label && (
        <label className="text-grey-label caption mb-2 ml-4 block" htmlFor={`input-${name}`}>
          {label}
        </label>
      )}
      <input
        id={`input-${name}`}
        className={cx(
          'focus:border-blue border-grey-border relative h-[44px] w-max min-w-full rounded-full border py-2 pl-5 text-black disabled:cursor-not-allowed',
          RightIcon ? 'pr-[55px]' : 'px-3',
          errorContent && 'border-red-dark',
          otherProps.disabled && 'bg-gray-100',
          otherProps.type === 'datetime-local' && 'invalid:text-grey-light', // this trick is to style the datetime-local placeholder
        )}
        data-testid="input"
        {...register(name, { setValueAs, onChange: debouncedOnChange, ...registerOptions })}
        {...otherProps}
        type={type}
      />

      {RightIcon && (
        <RightIcon className={cx('fill-grey-light pointer-events-none absolute right-[16px] size-7 -translate-y-1/2', label ? 'top-[48px]' : 'top-[22px]')} />
      )}
      {otherProps.type === 'password' && !RightIcon && (
        <EyeIcon
          className={cx('fill-grey-light absolute right-[16px] size-7 -translate-y-1/2', label ? 'top-[43px]' : 'top-[22px]')}
          onClick={onToggleShowPassword}
        />
      )}

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
