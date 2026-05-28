'use client';

import axiosInstance from '@/lib/axios';
import { useQuery } from '@tanstack/react-query';

export default function Home() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['tags', 'list'],
    queryFn: () => axiosInstance.get('/tags'),
  });

  console.log(data);
  return <div>Home page</div>;
}
