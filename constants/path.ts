export const appPath = {
  admin: {
    post: {
      list: '/dashboard/posts',
      new: '/posts/new',
      // detail: (id: string) => `/posts/${id}`,
      edit: (id: string) => `/posts/${id}/edit`,
    },
  },
};
