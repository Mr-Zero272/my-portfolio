'use client';

import { ScrollToTopButton } from "@/components/shared/scroll-to-top-button";
import { ListPostByTag, NewPosts } from "../components";


export const ListBlogsPage = () => {
  return (
    <div className="mt-8 flex flex-col gap-20 space-y-10 md:space-y-20 md:p-4">
      <NewPosts />
      <ListPostByTag />
      <ScrollToTopButton />
    </div>
  );
};