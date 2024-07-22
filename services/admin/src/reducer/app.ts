import { createSlice } from "@reduxjs/toolkit";

// id for anonymous users but preserved in localStorage
export const getFingerprint = (): string => {
  const current_fingerprint = window.localStorage.getItem("atlas:fingerprint");
  if (current_fingerprint) return current_fingerprint;

  const new_fingerprint = window.crypto.getRandomValues(new Uint32Array(1))[0].toString(16);
  window.localStorage.setItem("atlas:fingerprint", new_fingerprint);
  return new_fingerprint;
};

type AppState = {
  token: null | string;
  fingerprint: string;
};

const initialState: AppState = {
  fingerprint: getFingerprint(),
  token: window.localStorage.getItem("atlas:token") || null,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    login: (state, { payload: { token } }: { payload: { token: string } }) => {
      state.token = token;
      window.localStorage.setItem("atlas:token", token);
    },
    logout: (state) => {
      state.token = null;
      window.localStorage.removeItem("atlas:token");
    },
  },
});

export const actions = appSlice.actions;
export const reducer = appSlice.reducer;
