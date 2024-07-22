import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '@admin/reducer/app';
import type { RootState } from '@admin/store';
import type { AuthControllerMeResponse } from '@api/auth/Auth.schemas';
import { GET } from '@common/helpers';
import useSWR from 'swr';

export default function useMe() {
  const token = useSelector((state: RootState) => state.app.token);
  const dispatch = useDispatch();
  const { data: me, error } = useSWR<AuthControllerMeResponse>(token ? ["/auth/me"] : null, GET);

  React.useEffect(() => {
    if (error) dispatch(actions.logout());
  }, [dispatch, error]);

  return me;
}
