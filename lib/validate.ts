// function to check if a html content is empty
export const isEmptyHtml = (html: string) => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const text = doc.body.textContent?.trim() || '';
  return text.length === 0;
};
