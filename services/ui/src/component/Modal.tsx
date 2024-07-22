import { Dialog } from '@headlessui/react';
import cx from 'clsx';
import { IClose } from './Icons';

type Props = {
  title?: React.ReactNode;
  description?: string;
  isOpen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  className?: string;
  panelClassName?: string;
};

// Reference: https://headlessui.com/react/dialog
export const Modal = ({ title, description, children, isOpen, onClose, className }: Props) => {
  return (
    <Dialog open={isOpen} onClose={() => onClose?.()} className={cx('relative z-50', className)}>
      {/* The backdrop, rendered as a fixed sibling to the panel container */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Full-screen container to center the panel */}
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        {/* The actual dialog panel  */}
        <Dialog.Panel className="min-w-max rounded-xl bg-white p-8">
          <div className="mb-5 flex items-center justify-between">
            <div>{title}</div>
            <div onClick={onClose} className="cursor-pointer rounded-full p-1 hover:bg-gray-100">
              <IClose size={22} />
            </div>
          </div>
          {description && <Dialog.Description>{description}</Dialog.Description>}
          {children}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
