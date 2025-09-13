import { BaseCrudApiClient, BaseRecord } from '@/apis/base';
import { API_URL } from '@/configs/env';
import { Session } from 'next-auth';

export interface IBookingCrudApiClientOptions {
  resource: string;
}

let sessionPromise: Promise<Session | null> = Promise.resolve(null);

const customGetSession = async (): Promise<Session | null> => {
  if (await sessionPromise) return sessionPromise;
  if (typeof window === 'undefined') {
    const { auth } = await import('@/app/api/auth/[...nextauth]/auth');
    sessionPromise = auth();
  } else {
    const { getSession } = await import('next-auth/react');
    sessionPromise = getSession();
  }
  return sessionPromise;
};

customGetSession();

export class MyPortfolioCrudApiClient<T extends BaseRecord = BaseRecord> extends BaseCrudApiClient<T> {
  constructor({ resource }: IBookingCrudApiClientOptions) {
    const baseUrl = `${API_URL}/api/${resource}`;
    super({ baseUrl });
    this.client.interceptors.request.use(async (config) => {
      const session = await customGetSession();
      if (session) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        config.headers['Authorization'] = `Bearer ${session.accessToken}`;
      }

      return config;
    });
  }
}
