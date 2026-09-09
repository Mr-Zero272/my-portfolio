export const appPath = {
  admin: {
    mainSite: '/',
    post: {
      list: '/dashboard/posts',
      new: '/posts/new',
      // detail: (id: string) => `/posts/${id}`,
      edit: (id: string) => `/posts/${id}/edit`,
    },
    tag: {
      list: '/dashboard/tags',
    },
    gallery: {
      list: '/dashboard/galleries',
    },
    settings: {
      profile: '/app-settings/profile',
      appearance: '/app-settings/appearance',
      session: '/app-settings/session',
      experience: '/app-settings/experiences',
      project: '/app-settings/projects',
      education: '/app-settings/educations',
      skill: '/app-settings/skills',
      socialLink: '/app-settings/social-links',
    },
  },
};
