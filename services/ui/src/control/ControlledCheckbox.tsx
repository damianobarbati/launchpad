import React from 'react';
import cx from 'clsx';

type Props = {
  className?: string;
  indeterminate?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const ControlledCheckbox: React.FC<Props> = ({ className, indeterminate = false, ...otherProps }) => {
  const ref = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (!ref.current) return;
    ref.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return <input ref={ref} className={cx('appearance-none', className)} {...otherProps} />;
};
