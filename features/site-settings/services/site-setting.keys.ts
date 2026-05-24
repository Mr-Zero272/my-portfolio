export const siteSettingKeys = {
  all: ['siteSetting'] as const,

  // mutations
  onboarding: () => [...siteSettingKeys.all, 'onboarding'] as const,
};
