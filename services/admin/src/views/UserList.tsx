import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Link, useSearchParams } from 'react-router-dom';
import Table from '@admin/component/Table';
import UserForm from '@admin/component/UserForm';
import { UserListItemMenu } from '@admin/component/UserListItemMenu';
import useMe from '@admin/hook/useMe';
import { dateToYMDHM } from '@common/date';
import { emptyToUndefined, fromQuerystring, POST, toQuerystring, truncate } from '@common/helpers';
import type { ColumnDef, SortingState } from '@tanstack/react-table';
import type { ROLE } from '@type/Role';
import type { User } from '@type/User';
import { Button } from '@ui/component/Button';
import { CopyableText } from '@ui/component/CopyableText';
import { IconBadge } from '@ui/component/IconBadge';
import { IAdd, IFilters, ISearch } from '@ui/component/Icons';
import { Tab } from '@ui/component/Tab';
import { Tag } from '@ui/component/Tag';
import { Input } from '@ui/control/Input';
import { SelectMulti } from '@ui/control/SelectMulti';
import cx from 'clsx';
import { isEqual } from 'lodash-es';
import useSWR from 'swr';

export const getColumns = (role: ROLE | '', onAction?: (action: 'lock' | 'unlock') => void) => {
  const defaultColumns: ColumnDef<User>[] = [
    {
      accessorKey: 'id',
      header: 'Atlas ID',
      cell: (info) => {
        const id = info.getValue<string>();
        return (
          <CopyableText className="font-mono" copyText={id}>
            <Link className="anchor anchor-novisit" to={`/user/${id}`}>
              {truncate(id, 8, '')}
            </Link>
          </CopyableText>
        );
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Creation date',
      cell: (info) => {
        const value = info.getValue<string>();
        const rendered_value = value ? dateToYMDHM(value) : '-';
        return rendered_value;
      },
    },

    {
      accessorKey: 'name',
      header: 'Name',
      cell: (info) => {
        const value = info.getValue<string[]>();
        return <span className="truncate">{value}</span>;
      },
    },
    {
      accessorKey: 'email',
      header: 'Email',
      minSize: 300,
      cell: (info) => {
        const value = info.getValue<string[]>();
        return (
          <a className="truncate" href={`mailto:${value}`} rel="noreferrer">
            {value}
          </a>
        );
      },
    },
    {
      accessorKey: 'phone',
      header: 'Phone number',
      size: 200,
      cell: (info) => {
        const value = info.getValue<string[]>();
        return <span className="block w-full">{value || '-'}</span>;
      },
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: (info) => {
        const value = info.row.original.role || '';
        return <span className={cx('capitalize', value === 'ADMIN' && 'text-red-dark', value === 'GROUP' && 'text-grey-light')}>{value.toLowerCase()}</span>;
      },
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: (info) => {
        const value = info.getValue<boolean>();
        return <Tag className={cx('!p-2', value ? 'green' : 'red')}>{value ? 'enabled' : 'disabled'}</Tag>;
      },
    },
    {
      id: 'actions',
      header: '',
      size: 40,
      meta: { className: '!p-0' },
      cell: (info) => <UserListItemMenu onAction={onAction} row={info.row} />,
    },
  ];

  const agentAndDriverColumns: ColumnDef<User>[] = [
    {
      accessorKey: 'company_name',
      header: 'Company Name',
      size: 200,
      cell: (info) => {
        const value = info.getValue<string[]>();
        return <span className="truncate">{value}</span>;
      },
    },
    {
      accessorKey: 'logistics_ex_id',
      header: 'Provider ID',
      cell: (info) => {
        const logistics_ex_id = info.getValue<string>();
        const owner_logistics_ex_id = info.row.original.owner_logistics_ex_id;
        return logistics_ex_id || owner_logistics_ex_id || '-';
      },
    },
  ];

  const columns = [...defaultColumns];
  // if role is agent, we have different/some columns to add
  if (role === 'AGENT' || role === 'DRIVER') columns.splice(2, 0, ...agentAndDriverColumns);
  return columns;
};

type FormValues = {
  search: string;
  role: ROLE | '';
  isActive?: boolean;
};

const UserList = () => {
  const formRef = React.useRef<HTMLFormElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [openUserForm, setOpenUserForm] = React.useState<boolean>(false);
  const [showFilters, setShowFilters] = React.useState<boolean>(false);
  const me = useMe();

  const defaultSorting: SortingState = [{ id: 'name', desc: false }];

  const defaultValues: FormValues = {
    search: '',
    role: '',
    isActive: undefined,
  };

  const defaultValuesWithSearchValues = { ...defaultValues, ...fromQuerystring(searchParams, undefined, undefined, true) };

  const [values, setValues] = React.useState<typeof defaultValues>(defaultValuesWithSearchValues);

  const formContext = useForm({
    mode: 'onTouched',
    criteriaMode: 'all',
    shouldUnregister: true,
    shouldUseNativeValidation: false,
    shouldFocusError: true,
    defaultValues: defaultValuesWithSearchValues,
  });
  const { handleSubmit, formState, reset, getValues } = formContext;

  const swr = useSWR(formState.isValid ? ['/user/list', values, emptyToUndefined] : null, POST);

  const toggleFilters = () => setShowFilters(!showFilters);

  const resetFilters = () => {
    reset(defaultValues);
    setTimeout(triggerSubmit, 1);
  };

  // wait next tick or URL will not be updated
  const triggerSubmit = () => window.setTimeout(() => formRef.current?.requestSubmit(), 1);

  const onSubmit = async (values: FormValues) => {
    setSearchParams(toQuerystring(values), { replace: true });
    setValues(values);
    await swr.mutate();
  };

  const onChangeTab = (nextTab: string | number) => {
    const role = String(nextTab) as ROLE | '';
    formContext.setValue('role', role);
    window.setTimeout(triggerSubmit, 1);
  };

  const handleAddUser = () => {
    setOpenUserForm(true);
  };

  const handleAddUserClose = async () => {
    setOpenUserForm(false);
    await swr.mutate();
  };

  // we need to align to chosen tab
  const currentTab = getValues('role');
  const columns = React.useMemo(() => getColumns(currentTab, () => void swr.mutate()), [currentTab, swr]);
  const tabs: Record<string, string> =
    me?.role === 'ADMIN' ? { '': 'All', ADMIN: 'Admins', AGENT: 'Agents', DRIVER: 'Drivers' } : { '': 'All', AGENT: 'Agents', DRIVER: 'Drivers' };

  // we can't rely only on formState.isDirty because it's true when defaultValues provided to useForm are changed, but we may have filters set by default provided in the URL
  const clearFiltersEnabled = formState.isDirty || !isEqual(defaultValues, getValues());

  // we need active filters: if filter is of type array then we count if having least 1 selection, otherwise we count if being not nullish
  const filtersCount = React.useMemo(() => {
    let result = Object.values(values).filter((value) => (Array.isArray(value) ? value.length > 0 : Boolean(value))).length;
    if (currentTab !== '') result--;
    return result;
  }, [values, currentTab]);

  return (
    <main className="view-container">
      <UserForm isOpen={openUserForm} onClose={handleAddUserClose} onSave={handleAddUserClose} />
      <section className="flex flex-row place-content-between align-baseline">
        <h4>Users</h4>

        <div>
          <Button className="blue" LeftIcon={IAdd} onClick={handleAddUser}>
            ADD USER
          </Button>
        </div>
      </section>

      <section className="mt-4 rounded-2xl bg-white p-8 pb-4">
        <Tab tabs={tabs} defaultTab={currentTab} onChange={onChangeTab} />

        <div>
          <FormProvider {...formContext}>
            <form id="search-form" ref={formRef} className="my-8 flex flex-col gap-8" noValidate={true} onSubmit={handleSubmit(onSubmit)} autoComplete="off">
              <div className="flex place-content-between place-items-center">
                <Input
                  className="w-[360px]"
                  name={'search'}
                  placeholder={'Search by ID, name or email'}
                  required={true}
                  autoFocus={true}
                  RightIcon={ISearch}
                  autoComplete={'off'}
                  debouncedAutoSubmitForm={'#search-form'}
                  debouncedAutoSubmitTimeout={500}
                />

                <IconBadge
                  Icon={IFilters}
                  className="cursor-pointer"
                  iconClassname={'size-[24px] fill-gray-400'}
                  badge={filtersCount || null}
                  onClick={toggleFilters}
                />
              </div>

              {/* expanded filters section */}
              <div className={cx('bg-blue-sky flex flex-col gap-6 rounded-2xl p-4', !showFilters && 'hidden')}>
                <div className="flex flex-row gap-3">
                  <SelectMulti
                    label={'Status'}
                    name={'isActive'}
                    options={
                      new Map([
                        [true, 'Enabled'],
                        [false, 'Disabled'],
                      ])
                    }
                    selectable={'one'}
                    disableSearch={true}
                    closeOnChangedValue={true}
                    required={false}
                    hasClearAll={true}
                  />

                  {/* handled by tab changing, we need it otherwise it will be undefined when submitting the form */}
                  <SelectMulti
                    className="hidden"
                    label={'Role'}
                    name={'role'}
                    options={['', 'ADMIN', 'AGENT', 'DRIVER']}
                    selectable={'one'}
                    disableSearch={true}
                    closeOnChangedValue={true}
                  />
                </div>

                <div className="flex flex-row gap-4">
                  <Button className="blue-outlined h-max min-w-max max-w-max p-1" type="button" onClick={toggleFilters}>
                    Close
                  </Button>
                  <Button className="blue-outlined ml-auto min-w-max max-w-max" type="button" onClick={resetFilters} disabled={!clearFiltersEnabled}>
                    Clear filters
                  </Button>
                  <Button className="blue-outlined min-w-max max-w-max" disabled={showFilters && !formState.isDirty}>
                    Apply
                  </Button>
                </div>
              </div>
            </form>
          </FormProvider>
        </div>

        <Table
          className={cx('max-h-[calc(100vh-385px)]', !swr.data?.length && 'min-h-[200px]')}
          columns={columns}
          swr={swr}
          defaultSorting={defaultSorting}
          estimateSize={50}
          overscan={20}
          showTotal={true}
        />
      </section>
    </main>
  );
};

export default UserList;
