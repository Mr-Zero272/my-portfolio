'use client';

import { useEffect } from 'react';

interface ViewCounterProps {
  slug: string;
}

const ViewCounter = ({ slug }: ViewCounterProps) => {
  useEffect(() => {
    const incrementView = async () => {
      try {
        // Check if view has already been counted for this session
        const viewedPosts = sessionStorage.getItem('viewedPosts');
        const viewedPostsArray = viewedPosts ? JSON.parse(viewedPosts) : [];

        if (!viewedPostsArray.includes(slug)) {
          // Call API directly to avoid importing server-side code
          const res = await fetch(`/api/posts/${slug}/view`, {
            method: 'POST',
          });

          if (res.ok) {
            // Add slug to viewed posts in session storage
            viewedPostsArray.push(slug);
            sessionStorage.setItem('viewedPosts', JSON.stringify(viewedPostsArray));
          }
        }
      } catch (error) {
        console.error('Failed to increment view count:', error);
      }
    };

    // Wait for 5 seconds before counting view
    const timer = setTimeout(() => {
      incrementView();
    }, 5000);

    return () => clearTimeout(timer);
  }, [slug]);

  return null; // This component doesn't render anything
};

export default ViewCounter;
