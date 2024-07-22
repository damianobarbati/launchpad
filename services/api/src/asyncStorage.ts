import { AsyncLocalStorage } from 'node:async_hooks';
import type { User } from '@type/User';

export type Store = {
  user: User;
};

const asyncStorage = new AsyncLocalStorage<Store>();

export default asyncStorage;
