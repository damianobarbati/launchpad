import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from '@headlessui/react';
import { Float } from '@headlessui-float/react';
import type { Row } from '@tanstack/react-table';
import type { User } from '@type/User';
import { IDots, IEdit, IEye, ILocked, IUnlocked } from '@ui/component/Icons';
import { type DialogConfig, UserDialog } from './UserDialog';

type Props = {
  row: Row<User>;
  onAction?: (action: 'lock' | 'unlock') => void;
};

export const UserListItemMenu: React.FC<Props> = ({ row, onAction }) => {
  const [dialogConfig, setDialogConfig] = React.useState<DialogConfig | null>(null);

  const isEnabled = row.original.isActive;

  const handleLock = () => {
    setDialogConfig({ action: 'lock' });
  };

  const handleUnlock = () => {
    setDialogConfig({ action: 'unlock' });
  };

  const onDialogClosed = () => {
    setDialogConfig(null);
    if (onAction) onAction(isEnabled ? 'lock' : 'unlock');
  };

  return (
    <Menu>
      {dialogConfig && <UserDialog user={row.original} config={dialogConfig} onSave={onDialogClosed} onClose={onDialogClosed} isOpen={true} />}
      <Float
        portal={true}
        enter="transition ease-out duration-200"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
        placement="bottom-end"
      >
        <Menu.Button className="flex size-full place-content-center place-items-center" data-table-no-row-events>
          <IDots className="text-gray-400" size={28} data-table-no-row-events />
        </Menu.Button>
        <Menu.Items className="row-menu">
          <div className="p-1">
            <Menu.Item>
              <Link className="contents" to={`/user/${row.original.id}`}>
                <button className="row-menu-item">
                  <IEye size={20} />
                  View
                </button>
              </Link>
            </Menu.Item>
            <Menu.Item>
              <Link className="contents" to={`/user/${row.original.id}`}>
                <button className="row-menu-item">
                  <IEdit size={20} />
                  Edit
                </button>
              </Link>
            </Menu.Item>
            <Menu.Item>
              <button className="row-menu-item" onClick={isEnabled ? handleLock : handleUnlock}>
                {isEnabled ? <ILocked size={20} /> : <IUnlocked size={20} />}
                {isEnabled ? 'Lock' : 'Unlock'}
              </button>
            </Menu.Item>
          </div>
        </Menu.Items>
      </Float>
    </Menu>
  );
};
