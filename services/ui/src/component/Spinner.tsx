import type React from 'react';
import cx from 'clsx';

type Props = {
  className?: string;
  centered?: boolean;
  overlay?: boolean;
  blur?: boolean;
  size?: number;
  label?: string;
};

const preventActions = (event: any) => {
  event.stopPropagation();
  return false;
};

export const Spinner: React.FC<Props> = ({ className, size = 48, centered = false, overlay = false, blur = false, label }) => {
  return (
    <>
      <span
        className={cx(centered && 'absolute left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2', label && 'flex flex-row items-center gap-2', className)}
        data-testid="spinner"
      >
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-testid="spinner" className="animate-spin fill-current" width={size} height={size}>
          <path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25" />
          <path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z" />
        </svg>
        {label && <span className="ml-2">{label}</span>}
      </span>
      {overlay && <span onClick={preventActions} className={cx('absolute inset-0 z-40 bg-white/50', blur && 'backdrop-blur-[2px]')} />}
    </>
  );
};
