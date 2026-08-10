import { useMutation } from '@tanstack/react-query';
import { postApi } from '../../services';

export const useGenerateKeywords = () => {
  const mutation = useMutation({
    mutationFn: postApi.generateKeywords,
  });

  return mutation;
};
