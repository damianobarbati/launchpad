import type React from 'react';
import type { IconType } from 'react-icons';
import { openGoogleMaps } from '@common/helpers';
import type { METRIC_TYPE, METRIC_UNIT } from '@type/Metric';
import { IBatteryEmpty, IBatteryFull, IBatteryHalf, IHumidity, IPin, ITemperature } from '@ui/component/Icons';
import cx from 'clsx';

type Props = {
  className?: string;
  type: METRIC_TYPE;
  value: number | number[] | null | undefined;
  unit?: METRIC_UNIT;
  placeholder?: string;
  min?: number;
  max?: number;
};

const icons = {
  battery: IBatteryFull,
  temperature: ITemperature,
  humidity: IHumidity,
  position: IPin,
};

const defaultColor = {
  battery: 'text-green',
  temperature: 'text-grey',
  humidity: 'text-blue-water',
  position: 'text-grey',
};

const defaultUnit = {
  battery: '%',
  temperature: '°C',
  humidity: '%rH',
  coordinates: null,
};

const arrayGuard = (value: number | number[] | null | undefined): value is number[] => Array.isArray(value);
const numberGuard = (value: number | number[] | null | undefined): value is number => !isNaN(value as any);

export const Metric: React.FC<Props> = ({ className, type, value, unit, placeholder = '-', min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER }) => {
  if (!value) return placeholder;

  const Icon: IconType = icons[type];

  if (type === 'position') {
    if (!arrayGuard(value)) throw new Error('Position must be an array');

    return (
      <span className={cx('flex flex-row items-center gap-2', className)} onClick={openGoogleMaps([...value.reverse()].join(','))}>
        <Icon className="text-grey size-6" />
        <span className="anchor">{[...value].reverse().join(' , ')}</span>
      </span>
    );
  }
    if (!numberGuard(value)) throw new Error('Value must be a number');

    unit = unit ?? (defaultUnit[type] as METRIC_UNIT);
    const color = value <= min || value >= max ? 'text-red' : defaultColor[type];

    if (type === 'battery') {
      return (
        <span className={cx('flex flex-row items-center gap-2', className)}>
          {value >= 0 && value < 35 && <IBatteryEmpty className="text-red-dark size-6" />}
          {value >= 35 && value < 75 && <IBatteryHalf className="text-yellow size-6" />}
          {value >= 75 && <IBatteryFull className="text-green size-6" />}
          {value}%
        </span>
      );
    }
      return (
        <span className={cx('flex flex-row items-center gap-2', className)}>
          <Icon className={cx('size-6', color)} />
          {`${value}${unit}`}
        </span>
      );
};
