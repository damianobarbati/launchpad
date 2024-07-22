import axios from "@admin/axios";
import useMe from "@admin/hook/useMe";
import { actions } from "@admin/reducer/app";
import type { AuthControllerMeResponse } from "@api/auth/Auth.schemas";
import { AxiosError } from "axios";
import React from "react";
import { useDispatch } from "react-redux";

type Props = {
  timeout?: number;
};

const AuthWatcher: React.FC<Props> = ({ timeout = 60_000 }) => {
  const me = useMe();
  const dispatch = useDispatch();

  const authenticate = React.useCallback(async () => {
    // check if authenticated on api
    try {
      await axios.get<AuthControllerMeResponse>("/auth/me", { timeout: timeout - 1_000 });
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        const forbidden = error.response?.status === 401;
        const maintenance = error.response?.status === 503;
        if (forbidden || maintenance) dispatch(actions.logout());
      }
    }
  }, [dispatch, timeout]);

  React.useEffect(() => {
    if (!me) return;
    const intervalHandler = window.setInterval(authenticate, timeout);
    return () => {
      intervalHandler && window.clearInterval(intervalHandler);
    };
  }, [me, authenticate, timeout]);

  return null;
};

export default AuthWatcher;
