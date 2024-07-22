import { useNavigate } from 'react-router-dom';
import useMe from '@admin/hook/useMe';
import { DELETE, MPOST, MPUT } from '@common/helpers';
import { AppName } from '@type/AppName';
import type { User } from '@type/User';
import { Button } from '@ui/component/Button';
import { IDelete, ILocked, IRefresh, IUnlocked } from '@ui/component/Icons';
import { Modal } from '@ui/component/Modal';
import cx from 'clsx';
import useSWRMutation from 'swr/mutation';

export type DialogConfig = {
  action: 'edit' | 'delete' | 'reset-credentials' | 'lock' | 'unlock';
  redirect?: string;
};

type Props = {
  user: User;
  config: DialogConfig;
  onSave?: () => void;
  onClose?: () => void;
  isOpen: boolean;
};

export function UserDialog({ user, config, onSave, onClose, isOpen }: Props) {
  const navigate = useNavigate();
  const { action, redirect } = config;
  const me = useMe();
  const deleteSwr = useSWRMutation([`/user/${user.id}`], DELETE);
  const lockSwr = useSWRMutation(`/user/${user.id}`, MPUT);
  const resetSwr = useSWRMutation('/password/request', MPOST);

  if (!me) return null;

  const loading = deleteSwr.isMutating || resetSwr.isMutating || lockSwr.isMutating;
  const error = deleteSwr.error || resetSwr.error || lockSwr.error;
  const resetPasswordApp = user.role.toUpperCase() === 'DRIVER' ? AppName.Driver : AppName.Admin;

  const onConfirm = async () => {
    try {
      switch (action) {
        case 'delete':
          await deleteSwr.trigger();
          break;
        case 'reset-credentials':
          await resetSwr.trigger({ email: user.email, app: resetPasswordApp });
          break;
        case 'lock':
          await lockSwr.trigger({ isActive: false });
          break;
        case 'unlock':
          await lockSwr.trigger({ isActive: true });
          break;
      }
      if (onSave) onSave();
      if (redirect) navigate(redirect);
    } catch (error) {
      // tofix: user must be informed about the error and how to resolve it
      console.error(error);
    }
  };

  return (
    <Modal key={user.id} isOpen={isOpen} onClose={onClose}>
      <div className="flex w-[450px] flex-col gap-8">
        <div className="flex grow items-center justify-center">
          {action === 'reset-credentials' && <IRefresh size={128} className="blue rounded-full bg-blue-100 p-2" />}
          {action === 'delete' && <IDelete size={128} className="blue rounded-full bg-blue-100 p-2" />}
          {action === 'lock' && <ILocked size={128} className="blue rounded-full bg-blue-100 p-2" />}
          {action === 'unlock' && <IUnlocked size={128} className="blue rounded-full bg-blue-100 p-2" />}
        </div>
        {action === 'delete' && <h4 className="text-center">Delete user</h4>}
        {action === 'lock' && <h4 className="text-center">Lock user</h4>}
        {action === 'unlock' && <h4 className="text-center">Unlock user</h4>}
        {action === 'reset-credentials' && (
          <>
            <h4 className="text-center">Reset credentials</h4>
            <p className="text-center">An email with instructions on how to reset the password will be sent.</p>
          </>
        )}
        {!error && <p className="text-center">Are you sure you want to continue?</p>}
        {error && <p className="red text-center">There was an error while processing your request. Please try again later.</p>}
        <div className="mt-6 flex w-full gap-4">
          <Button onClick={onClose} className="blue-outlined">
            Back
          </Button>
          <Button loading={loading} onClick={onConfirm} className={cx(action === 'delete' ? 'red' : 'blue')}>
            Confirm
          </Button>
        </div>
      </div>
    </Modal>
  );
}
