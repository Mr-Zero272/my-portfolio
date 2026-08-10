import { useMutation } from '@tanstack/react-query';
import { postApi } from '../../services';

export const useGenerateExcerpt = () => {
  const mutation = useMutation({
    mutationFn: postApi.generateExcerpt,
  });

  return mutation;
};
