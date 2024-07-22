import type React from 'react';
import cx from 'clsx';

type Props = {
  className?: string;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Tag: React.FC<Props> = ({ className, children, ...otherProps }: Props) => {
  return (
    <span className={cx('max-w-max cursor-default text-nowrap rounded-lg font-bold', children ? 'p-3' : 'border-2 px-3 py-1', className)} {...otherProps}>
      {children}
    </span>
  );
};
