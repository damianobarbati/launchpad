import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import useMe from '@admin/hook/useMe';
import { GET, MPOST, MPUT, POST } from '@common/helpers';
import type { ROLE } from '@type/Role';
import type { User } from '@type/User';
import { Button } from '@ui/component/Button';
import { ICheck } from '@ui/component/Icons';
import { Modal } from '@ui/component/Modal';
import { Spinner } from '@ui/component/Spinner';
import { Checkbox } from '@ui/control/Checkbox';
import { Input } from '@ui/control/Input';
import { SelectMulti } from '@ui/control/SelectMulti';
import debounce from 'awesome-debounce-promise';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

type FormValues = {
  id?: string;
  role: ROLE | '';
  company_id: string;
  logistics_ex_id: string;
  company_name: string;
  email: string;
  name: string;
  phone?: string;
  send_credentials: boolean;
};

export type UserFormProps = {
  userId?: string;
  onSave?: () => void;
  onClose?: () => void;
  isOpen: boolean;
};

export function UserForm({ userId, onSave, onClose, isOpen }: UserFormProps) {
  const me = useMe();
  const isEdit = !!userId;
  const userSWR = useSWR<User>(isEdit ? [`/user/${userId}`] : null, GET);
  const companiesSWR = useSWR<User[]>(['/user/list', { role: 'GROUP', includeGroups: true }], POST);
  const companies = companiesSWR.data;
  const user = userSWR.data;
  const userCompany = React.useMemo(() => (!user ? null : companies?.find((company) => company.name === user.company_name)), [companies, user]);
  const myCompany = React.useMemo(() => (!me ? null : companies?.find((company) => company.name === me.company_name)), [companies, me]);

  const createMutation = useSWRMutation('/user', MPOST);
  const updateMutation = useSWRMutation(`/user/${userId}`, MPUT);
  const existsMutation = useSWRMutation('/user/exists', MPOST);

  const isLoading = !!(createMutation.isMutating || updateMutation.isMutating || companiesSWR.isValidating || (userId && userSWR.isValidating));
  const isError = createMutation.error || updateMutation.error || companiesSWR.error || (userId && userSWR.error);

  const companiesOptions = React.useMemo(() => {
    if (!companies) return [];
    const options = companies
      .filter((c) => c.name !== 'ADMINS')
      .reduce(
        (acc, company) => {
          acc[company.id] = company.name;
          return acc;
        },
        { NEW: 'Create new company' },
      );
    return options;
  }, [companies]);

  const formMethods = useForm<FormValues>({
    mode: 'onTouched',
    criteriaMode: 'all',
    reValidateMode: 'onChange',
    shouldUnregister: true,
    defaultValues: {
      role: user?.role || '',
      company_id: userCompany?.id || myCompany?.id || '',
      logistics_ex_id: '',
      company_name: user?.company_name || '',
      email: user?.email || '',
      name: user?.name || '',
      phone: user?.phone || '',
      send_credentials: false,
    },
  });

  const { register, watch, handleSubmit, formState } = formMethods;
  const [company_id, company_name] = watch(['company_id', 'company_name']);

  const onSubmit = async (values: FormValues) => {
    const selectedCompany = companies?.find((company) => company.id === values.company_id);
    let owner_id = user?.owner_id || selectedCompany?.id || myCompany?.id;

    if (values.company_id === 'NEW') {
      const newCompany = await createMutation.trigger({
        name: values.company_name,
        company_name: values.company_name,
        logistics_ex_id: values.logistics_ex_id,
        role: 'GROUP',
        creator_id: me?.id,
        send_credentials: values.send_credentials,
      });
      if (!newCompany) return;
      owner_id = newCompany.id;
      await companiesSWR.mutate();
    }

    const payload = {
      id: user?.id || undefined,
      name: values.name,
      company_name: selectedCompany?.name || values.company_name || userCompany?.name || myCompany?.name,
      email: values.email,
      role: values.role,
      ...(!isEdit && { owner_id, creator_id: me?.id }), // tofix: this ? chaining should not be here, fix the me/isLoading problem and make sure onSubmit is created after me is fetched
      phone: values.phone,
      send_credentials: values.send_credentials,
    };

    if (isEdit) await updateMutation.trigger(payload);
    else await createMutation.trigger(payload);

    if (onSave) void onSave();
  };

  // tofix: actually this debounced validator is not working and firing at most 200ms, but it's running onBlur event which for now is ok anyway...
  const isUniqueLogisticsExId = React.useMemo(
    () =>
      debounce(async (value) => {
        const userExists = await existsMutation.trigger({ logistics_ex_id: value });
        return !userExists;
      }, 200),
    [existsMutation],
  );

  // tofix: actually this debounced validator is not working and firing at most 200ms, but it's running onBlur event which for now is ok anyway...
  const isUniqueEmail = React.useMemo(
    () =>
      debounce(async (value) => {
        // This form is used both for user creation and updates (eg: profile).
        // If the user is changing its data, the user is already saved and the email is already in db.
        // In that case, we check that the email is not in use by another user ONLY IF the user is changing it.
        if (isEdit && value === user?.email) return true;
        const userExists = await existsMutation.trigger({ email: value });
        return !userExists;
      }, 200),
    [isEdit, user?.email, existsMutation],
  );

  // tofix: we can't check for !me || isLoading here, because otherwise we destroy the form once submitted. If there's an error, the form is then rerendered with empty values (because lost)
  // we should consider moving the useMe hook to a Suspense logic, so Routes are suspender with loader until me if fetched (and shared without fetching on each view load)
  if (!me) return <Spinner centered={true} overlay={true} blur={true} label="Storing user in the blockchain..." />;

  return (
    <Modal title={<h3>{isEdit ? `Edit user ${user?.name}` : 'New user'}</h3>} isOpen={isOpen} onClose={onClose}>
      {isLoading && <Spinner centered={true} overlay={true} blur={true} />}

      <FormProvider {...formMethods}>
        <form className="flex w-[600px] flex-col gap-6" autoCorrect={'off'} autoComplete={'off'} onSubmit={handleSubmit(onSubmit)} noValidate={true}>
          {userId && <input type={'hidden'} {...register('id')} />}

          <div className="flex flex-row gap-2">
            {!isEdit && (
              <SelectMulti
                className="w-1/2"
                name={'role'}
                label={'User type'}
                options={['AGENT', 'DRIVER'] satisfies ROLE[]}
                selectable={'one'}
                disableSearch={true}
                closeOnChangedValue={true}
                required={true}
                hasClearAll={true}
              />
            )}
            {!isEdit && me.role === 'ADMIN' && (
              <SelectMulti
                className="w-1/2"
                name={'company_id'}
                label={'Company'}
                options={companiesOptions}
                selectable={'one'}
                disableSearch={true}
                closeOnChangedValue={true}
                required={false}
                hasClearAll={true}
              />
            )}
          </div>

          {me.role === 'ADMIN' && company_id === 'NEW' && !isEdit && (
            <div className="flex w-full flex-row items-start gap-2 rounded-xl bg-gray-50 p-4">
              <Input
                className="w-full"
                name={'company_name'}
                label={'Company name'}
                placeholder="e.g. My Company"
                registerOptions={{ required: true }}
                autoFocus={false}
              >
                {formState.errors.company_name?.type === 'required' ? 'Required' : null}
              </Input>
              <Input
                className="w-full"
                name={'logistics_ex_id'}
                label={'Logistics Provider ID'}
                placeholder="e.g. 123456"
                registerOptions={{
                  required: true,
                  validate: { isUnique: isUniqueLogisticsExId },
                }}
                autoFocus={false}
              >
                {formState.errors.logistics_ex_id?.type === 'required' ? 'Required' : null}
                {formState.errors.logistics_ex_id?.type === 'isUnique' ? 'Logistics ID already in use' : null}
              </Input>
            </div>
          )}

          <Input
            name={'email'}
            label={'Email'}
            placeholder="e.g. john.doe@gmail.com"
            registerOptions={{
              required: true,
              validate: {
                isUnique: isUniqueEmail,
                isEmail: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
              },
            }}
          >
            {formState.errors.email?.type === 'required' ? 'Required' : null}
            {formState.errors.email?.type === 'isUnique' ? 'Email already in use' : null}
            {formState.errors.email?.type === 'isEmail' ? 'Invalid email format' : null}
          </Input>

          <Input
            name={'name'}
            label={'Full name'}
            placeholder="e.g. John Doe"
            registerOptions={{
              required: true,
              validate: {
                isNotCompanyName: (value) => !value || value !== company_name,
              },
            }}
          >
            {formState.errors.name?.type === 'isNotCompanyName' ? 'User name cannot be the same as company name' : null}
            {formState.errors.name?.type === 'required' ? 'Required' : null}
          </Input>

          <Input name={'phone'} label={'Phone number'} placeholder="e.g. +1234567890">
            {formState.errors.phone ? 'Required' : null}
          </Input>

          {!isEdit && <Checkbox name={'send_credentials'} label={'Send credentials'} />}

          <div className="mt-8 flex items-center gap-4">
            <Button type="button" className="blue-outlined col-span-2 justify-self-end" onClick={onClose}>
              BACK
            </Button>
            <Button
              className="blue col-span-2 justify-self-end"
              loading={isLoading}
              disabled={!formState.isValid || !formState.isDirty}
              RightIcon={!isLoading && formState.isSubmitSuccessful ? ICheck : undefined}
            >
              SAVE
            </Button>
          </div>

          {!!isError && <pre className="red">There was an error while processing your request. Please try again later.</pre>}
        </form>
      </FormProvider>
    </Modal>
  );
}

export default UserForm;
