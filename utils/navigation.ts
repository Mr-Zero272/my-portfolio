export const buildHref = ({
  url,
  applyBaseHref,
  baseHref,
}: {
  url: string;
  applyBaseHref?: boolean;
  baseHref?: string;
}) => {
  if (applyBaseHref === false || !baseHref) {
    return url;
  }

  return `${baseHref || ''}${url}`;
};
