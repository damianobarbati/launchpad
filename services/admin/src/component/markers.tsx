import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { IBox, ICircle, ITruck } from '@ui/component/Icons';
import cx from 'clsx';
import { divIcon } from 'leaflet';

export const MarkerIcon = (className?: string) =>
  divIcon({
    html: renderToStaticMarkup(<ICircle size={20} className={cx('fill-blue stroke-white stroke-2', className)} />),
    iconAnchor: [10, 10],
    iconSize: [20, 20],
    popupAnchor: [0, -10],
    className: '',
  });

export const MarkerPackage = (className?: string) =>
  divIcon({
    html: renderToStaticMarkup(<IBox size={20} className={cx('bg-aqua w-max rounded-full stroke-white stroke-2 p-1', className)} />),
    iconAnchor: [10, 10],
    iconSize: [20, 20],
    popupAnchor: [0, -10],
    className: '',
  });

export const MarkerTruck = (className?: string) =>
  divIcon({
    html: renderToStaticMarkup(
      <div className={cx('bg-aqua w-max rounded-full p-1', className)}>
        <ITruck size={16} className="fill-white" />
      </div>,
    ),
    iconAnchor: [10, 10],
    iconSize: [20, 20],
    popupAnchor: [0, -10],
    className: '',
  });

export const MarkerNumber = ({ className, number }: { className?: string; number: string | number }) =>
  divIcon({
    html: renderToStaticMarkup(
      <svg className={className} viewBox="0 0 36 36" height="36" width="36">
        <path stroke="white" strokeWidth="1" d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2z" />
        <text className="fill-white font-[montserrat] font-bold" x="12" y="13" dominantBaseline="middle" textAnchor="middle">
          {number}
        </text>
      </svg>,
    ),
    iconAnchor: [10, 10],
    iconSize: [20, 20],
    popupAnchor: [0, -10],
    className: '',
  });
