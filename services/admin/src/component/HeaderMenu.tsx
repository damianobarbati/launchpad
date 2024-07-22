import React from 'react';
import { Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import useMe from '@admin/hook/useMe';
import { actions } from '@admin/reducer/app';
import { Popover, Transition } from '@headlessui/react';
import { IDown, ILogout, IUser } from '@ui/component/Icons';

export const HeaderMenu = () => {
  const me = useMe();
  const dispatch = useDispatch();
  const logout = () => dispatch(actions.logout());

  if (!me) return null;

  return (
    <div className="relative flex max-w-sm items-center justify-self-end px-4">
      <Popover className="relative">
        <Popover.Button className="group flex items-center justify-center rounded-md px-3 py-2 text-white outline-none">
          <span className="whitespace-nowrap">{me?.name}</span>
          <IDown className="ml-2 size-5 text-white transition duration-150 ease-in-out" aria-hidden="true" />
        </Popover.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <Popover.Panel className="absolute left-1/2 z-50 mt-6 w-48 -translate-x-1/2 rounded-2xl shadow-lg">
            <div className="relative flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-lg outline-none">
              <Link className="flex flex-row items-center gap-4 hover:opacity-85" to={`/user/${me.id}`}>
                <IUser size={24} />
                <span>Profile</span>
              </Link>
              <Link className="flex flex-row items-center gap-4 hover:opacity-85" to={'#'} onClick={logout}>
                <ILogout size={24} />
                <span>Logout</span>
              </Link>
            </div>
          </Popover.Panel>
        </Transition>
      </Popover>
    </div>
  );
};
