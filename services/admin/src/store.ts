import { reducer as appReducer } from '@admin/reducer/app';
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    app: appReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
