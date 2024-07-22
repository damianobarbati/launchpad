import React from 'react';
import { NavLink } from 'react-router-dom';
import cx from 'clsx';

type Props = {
  className?: string;
  items: { label: string; path?: string }[];
};

export const Breadcrumb: React.FC<Props> = ({ className, items }) => {
  return (
    <div className={cx('flex items-start gap-2', className)}>
      {items.map((item, index) =>
        index < items.length - 1 ? (
          <React.Fragment key={index}>
            {item.path ? (
              <NavLink to={item.path} end={true}>
                <p className="body3 text-grey-dark opacity-60">{item.label}</p>
              </NavLink>
            ) : (
              <p className="body3 text-grey-dark opacity-60">{item.label}</p>
            )}
            <p className="body3 text-grey-dark">/</p>
          </React.Fragment>
        ) : (
          <p key={index} className="body3">
            {item.label}
          </p>
        ),
      )}
    </div>
  );
};
