import type React from 'react';
import type { IconType } from 'react-icons';
import cx from 'clsx';

type Props = {
  className?: string;
  children: React.ReactNode;
  LeftIcon?: IconType;
  RightIcon?: IconType;
  disabled?: boolean;
  loading?: boolean;
  spinnerClassname?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button: React.FC<Props> = ({
  children,
  className,
  LeftIcon,
  RightIcon,
  loading,
  spinnerClassname = 'fill-white',
  disabled,
  ...otherProps
}: Props) => {
  return (
    <button
      className={cx(
        'button flex h-[40px] w-full items-center justify-center gap-2 text-nowrap rounded-full p-3 px-5 font-bold uppercase',
        // tofix: animation is broken
        // 'min-w-[50px] max-w-max transition-all duration-1000 ease-out',
        loading && 'cursor-default opacity-75',
        disabled && 'cursor-default !border-0 !bg-[#EBEDEE] !text-[#9CA3AF]',
        className,
      )}
      disabled={loading || disabled}
      {...otherProps}
    >
      <div className={cx('flex items-center justify-center gap-2', loading && 'opacity-80')}>
        {LeftIcon && <span>{<LeftIcon size={24} />}</span>}
        <span>{children}</span>
        {RightIcon && <span>{<RightIcon size={24} />}</span>}
      </div>
      {loading && (
        <svg viewBox="0 0 24 24" width={24} xmlns="http://www.w3.org/2000/svg" data-testid="spinner" className={cx('animate-spin', spinnerClassname)}>
          <path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25" />
          <path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z" />
        </svg>
      )}
    </button>
  );
};
