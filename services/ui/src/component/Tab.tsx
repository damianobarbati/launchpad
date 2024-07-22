import React from 'react';
import cx from 'clsx';

type Props = {
  className?: string;
  tabs: Record<string, string>;
  defaultTab: string;
  onChange: (x: string | number) => void | Promise<void>;
};

export const Tab: React.FC<Props> = ({ className, tabs, defaultTab, onChange, ...otherProps }: Props) => {
  const [current, setCurrent] = React.useState<string>(defaultTab);

  const onClick = (key: string) => () => {
    setCurrent(key);
    void onChange(key);
  };

  return (
    <div className={cx('border-b-2 border-b-gray-300', className)} {...otherProps}>
      <div className="grid w-max grid-cols-[repeat(4,100px)]">
        {Object.entries(tabs).map(([key, label]) => (
          <span
            key={key}
            className={cx(
              'mb-[-2px] w-full cursor-pointer border-b-2 pb-2 text-center transition-colors duration-300',
              key !== current && 'border-b-gray-300',
              key === current && 'border-b-blue text-blue',
            )}
            onClick={onClick(key)}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
};
