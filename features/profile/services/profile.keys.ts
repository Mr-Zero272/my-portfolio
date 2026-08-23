export const profileQueryKeys = {
  all: ['profile'] as const,
  me: () => [...profileQueryKeys.all, 'me'] as const,
  public: () => [...profileQueryKeys.all, 'public'] as const,
};
