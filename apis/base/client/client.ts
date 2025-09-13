import { AxiosInstance } from 'axios';

export class BaseApiClient {
  protected client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;

    client.interceptors.request.use(async (config) => {
      return config;
    });

    client.interceptors.response.use(
      async (response) => {
        if (!Object.hasOwn(response.data, 'data')) {
          return {
            data: response.data,
          };
        }
        return response.data;
      },
      (error) => {
        if (error.response) {
          const message =
            typeof error.response.data.message === 'string'
              ? error.response.data.message
              : Array.isArray(error.response.data.message)
                ? error.response.data.message.join(' ')
                : JSON.stringify(error.response.data.message);
          throw new Error(message, { cause: error.response.data });
        }
        throw error;
      },
    );
  }
}
