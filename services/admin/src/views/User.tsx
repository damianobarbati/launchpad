import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import Table from '@admin/component/Table';
import type { DialogConfig } from '@admin/component/UserDialog';
import { UserDialog } from '@admin/component/UserDialog';
import UserForm from '@admin/component/UserForm';
import useMe from '@admin/hook/useMe';
import { GET, POST, truncate } from '@common/helpers';
import type { User } from '@type/User';
import { Breadcrumb } from '@ui/component/Breadcrumb';
import { Button } from '@ui/component/Button';
import { CopyableText } from '@ui/component/CopyableText';
import { IEdit, ILocked, IRefresh, ISearch, IUnlocked } from '@ui/component/Icons';
import { Spinner } from '@ui/component/Spinner';
import { Tag } from '@ui/component/Tag';
import { Input } from '@ui/control/Input';
import cx from 'clsx';
import useSWR from 'swr';
import { getColumns } from './UserList';

type FormValues = {
  search: string;
};

const UserDetail = () => {
  const { id: userId } = useParams();
  const me = useMe();
  const userSWR = useSWR<User>([`/user/${userId}`], GET);
  const [dialogConfig, setDialogConfig] = React.useState<DialogConfig | null>(null);
  const [openEditDialog, setOpenEditDialog] = React.useState<boolean>(false);

  const { data: user } = userSWR;

  const defaultValues: FormValues = {
    search: '',
  };
  const [values, setValues] = React.useState<typeof defaultValues>(defaultValues);

  const formContext = useForm({
    mode: 'onTouched',
    criteriaMode: 'all',
    shouldUnregister: true,
    shouldUseNativeValidation: false,
    shouldFocusError: true,
    defaultValues,
  });
  const { handleSubmit } = formContext;

  const swr = useSWR(
    [
      '/user/list',
      {
        role: 'DRIVER',
        company_name: user?.company_name,
        ...values,
      },
    ],
    POST,
    { keepPreviousData: true },
  );

  if (!user || !me) return <Spinner centered={true} />;
  const isMe = userId === me.id;
  const isEnabled = user.isActive;

  const handleEdit = () => {
    setOpenEditDialog(true);
  };

  const handleResetCredentials = () => {
    setDialogConfig({ action: 'reset-credentials' });
  };

  const handleLock = () => {
    setDialogConfig({ action: 'lock' });
  };

  const handleUnlock = () => {
    setDialogConfig({ action: 'unlock' });
  };

  const onSubmit = (data: FormValues) => {
    setValues(data);
    void swr.mutate();
  };

  const onDialogClosed = () => {
    setDialogConfig(null);
    setOpenEditDialog(false);
    void swr.mutate();
    void userSWR.mutate();
  };

  return (
    <main className="view-container flex flex-col gap-4">
      {openEditDialog && <UserForm isOpen={true} onClose={onDialogClosed} onSave={onDialogClosed} userId={userId} />}
      {dialogConfig && <UserDialog user={user} config={dialogConfig} onSave={onDialogClosed} onClose={onDialogClosed} isOpen={true} />}
      <Breadcrumb className="mb-6" items={[{ label: 'Users', path: '/users' }, { label: 'User details' }]} />

      <section className="paper flex flex-col gap-8 !p-6">
        <Detail label={'Atlas ID'}>
          <CopyableText className="font-mono" copyText={userId || '-'}>
            {truncate(userId || '-', 8, '')}
          </CopyableText>
        </Detail>
        <Detail label={'Provider ID'}>{user.logistics_ex_id || user.owner_logistics_ex_id || '-'}</Detail>
        <Detail label={'Status'}>
          <Tag className={cx('!p-2', user.isActive ? 'green' : 'red')}>{user.isActive ? 'enabled' : 'disabled'}</Tag>
        </Detail>
        <Detail label={'Name'}>
          <strong>{user.name || '-'}</strong>
        </Detail>
        <Detail label={'Supplier'}>{user.company_name}</Detail>
        <Detail label={'Email'}>{user.email || '-'}</Detail>
        <Detail label={'Phone Number'}>{user.phone || '-'}</Detail>
        <Detail label={'Role'}>
          <Tag className="blue !p-2">{user.role}</Tag>
        </Detail>

        <hr />

        {!user.deleted_at && (
          <div className="flex w-full gap-2">
            <Button className="blue max-w-max" onClick={handleEdit} LeftIcon={IEdit}>
              EDIT
            </Button>
            <Button className="blue-outlined max-w-max" onClick={handleResetCredentials} LeftIcon={IRefresh}>
              RESET CREDENTIALS
            </Button>
            {!isMe && (
              <Button className="blue-outlined max-w-max" onClick={isEnabled ? handleLock : handleUnlock} LeftIcon={isEnabled ? ILocked : IUnlocked}>
                {(isEnabled && 'LOCK') || 'UNLOCK'}
              </Button>
            )}
          </div>
        )}
        {user.deleted_at && <p className="red">This user has been deleted.</p>}
      </section>

      {user.role === 'AGENT' && (
        <section className="paper flex flex-col gap-8 !p-6">
          <h6>Drivers</h6>
          <FormProvider {...formContext}>
            <form className="mt-4 flex flex-col gap-8" noValidate={true} onSubmit={handleSubmit(onSubmit)} autoComplete="off">
              {/* search and button to expand filters section */}
              <div className="flex place-content-between place-items-center">
                <Input
                  className="w-[360px]"
                  name={'search'}
                  placeholder={'Search by ID, name or email'}
                  required={true}
                  autoFocus={true}
                  RightIcon={ISearch}
                  autoComplete={'off'}
                />
              </div>

              <Button className="hidden">Submit</Button>
            </form>
          </FormProvider>
          <Table
            className={cx('max-h-[calc(100vh-445px)]', !swr.data?.length && 'min-h-[200px]')}
            columns={getColumns('DRIVER', () => void swr.mutate())}
            swr={swr}
            estimateSize={50}
            overscan={20}
            showTotal={false}
          />
        </section>
      )}
    </main>
  );
};

type Props = {
  label: string;
  children: React.ReactNode;
};

const Detail: React.FC<Props> = ({ label, children }: Props) => (
  <span className="body1 flex flex-row items-start gap-16">
    <span className="text-grey-label w-48">{label}</span>
    <span className="">{children}</span>
  </span>
);

export default UserDetail;
