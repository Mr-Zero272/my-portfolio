export const appPath = {
  admin: {
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
      profile: '/settings/profile',
      appearance: '/settings/appearance',
      session: '/settings/session',
      experience: '/settings/experience',
      project: '/settings/project',
      education: '/settings/education',
      skill: '/settings/skill',
      socialLink: '/settings/social-link',
    },
  },
};
