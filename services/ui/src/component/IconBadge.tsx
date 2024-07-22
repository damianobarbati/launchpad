import type React from 'react';
import type { IconType } from 'react-icons';
import cx from 'clsx';

type Props = {
  className?: string;
  Icon: IconType;
  iconClassname?: string;
  iconSize?: number;
  iconFill?: string;
  badge: string | number | null;
} & React.InputHTMLAttributes<HTMLDivElement>;

export const IconBadge: React.FC<Props> = ({ className, Icon, iconClassname, iconSize = 36, iconFill, badge, ...otherProps }) => {
  return (
    <div className={cx('relative', className)} {...otherProps}>
      <Icon className={iconClassname} fill={iconFill} size={iconSize} />
      {badge && (
        <span className="absolute right-[-5px] top-[-5px] flex size-5 place-content-center place-items-center rounded-full bg-sky-400 font-bold text-white">
          {badge}
        </span>
      )}
    </div>
  );
};
