export const appPath = {
  post: {
    list: '/posts',
    new: '/posts/new',
    detail: (id: string) => `/posts/${id}`,
    edit: (id: string) => `/posts/${id}/edit`,
  },
};
