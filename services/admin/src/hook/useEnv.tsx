import type { EnvControllerGetResponse } from '@api/env/Env.schema';
import { GET } from '@common/helpers';
import useSWR from 'swr';

export default function useEnv() {
  const { data: env, error } = useSWR<EnvControllerGetResponse>(["/env"], GET);
  if (error) console.error(error);
  return env;
}
