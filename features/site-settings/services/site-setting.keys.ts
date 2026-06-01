export const siteSettingKeys = {
  all: ['siteSetting'] as const,
  detail: () => [...siteSettingKeys.all, 'detail'] as const,

  // mutations
  onboarding: () => [...siteSettingKeys.all, 'onboarding'] as const,
  update: () => [...siteSettingKeys.all, 'update'] as const,
};
