import { useState } from 'react';
import { Switch } from '@headlessui/react';

type Props = {
  checked: boolean;
  onChange: (value: boolean) => void;
  className?: string;
};

export const Toggle = ({ checked, onChange, className, ...otherProps }: Props) => {
  const [enabled, setEnabled] = useState(checked);

  const handleChange = (value: boolean) => {
    setEnabled(value);
    onChange(value);
  };

  return (
    <Switch
      checked={enabled}
      onChange={handleChange}
      className={`${enabled ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full`}
      {...otherProps}
    >
      <span className={`${enabled ? 'translate-x-6' : 'translate-x-1'} inline-block size-4 rounded-full bg-white transition`} />
    </Switch>
  );
};
