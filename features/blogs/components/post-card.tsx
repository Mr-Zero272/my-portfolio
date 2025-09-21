import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { IPost, ITag } from '@/models';
import { format } from 'date-fns';
import { Dot } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
  post: IPost & {
    tags: ITag[];
  };
  variant?: 'horizontal' | 'vertical';
  isMainPost?: boolean;
  isDisplayExcerpt?: boolean;
  isDisplayAuthorAvatar?: boolean;
  isHasHoverEffect?: boolean;
  className?: string;
};

const PostCard = ({
  post,
  variant = 'horizontal',
  isMainPost = false,
  isDisplayExcerpt = false,
  isDisplayAuthorAvatar = false,
  isHasHoverEffect = false,
  className = '',
}: Props) => {
  const { title, excerpt, featureImage, tags, slug, createdAt } = post;
  const firstTag = tags && tags.length > 0 ? tags[0].name : 'Uncategorized';
  return (
    <Link
      href={`/piti/blog/${slug}`}
      className={cn(
        'group flex',
        {
          'flex-col': variant === 'vertical',
          'flex-row': variant === 'horizontal',
        },
        className,
      )}
    >
      <div className="flex-1">
        <Image
          src="https://i.pinimg.com/1200x/69/f1/b6/69f1b694abb303ffb5ae7bfccef465c5.jpg"
          alt="Post Image"
          width={400}
          height={300}
          className={cn('w-full rounded-lg object-cover', {
            'max-h-[180px]': variant === 'horizontal',
            'max-h-[280px]': variant === 'vertical',
            'max-h-[320px]': isMainPost,
          })}
        />
      </div>
      <div
        className={cn('line-clamp-2 flex flex-1 flex-col justify-between space-y-3 p-4', {
          'space-y-5 py-8': isMainPost,
        })}
      >
        <div
          className={cn('space-y-3', {
            'space-y-5': isMainPost,
          })}
        >
          {variant === 'horizontal' && (
            <div
              className={cn('w-fit rounded-full bg-green-100 px-4 py-0.5 text-sm text-green-700', {
                'text-base': isMainPost,
              })}
            >
              {firstTag}
            </div>
          )}
          <h2
            className={cn('text-lg font-bold', {
              'text-2xl': isMainPost,
              'group-hover:underline': isHasHoverEffect,
            })}
          >
            {title}
          </h2>
          {isMainPost ? (
            <p className="text-muted-foreground line-clamp-2">{excerpt}</p>
          ) : (
            isDisplayExcerpt && <p className="text-muted-foreground line-clamp-2">{excerpt}</p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {isMainPost ? (
              <Image
                src="https://i.pinimg.com/1200x/69/f1/b6/69f1b694abb303ffb5ae7bfccef465c5.jpg"
                alt="Author Avatar"
                width={24}
                height={24}
                className="size-8 rounded-full"
              />
            ) : (
              isDisplayAuthorAvatar && (
                <Image
                  src="https://i.pinimg.com/1200x/69/f1/b6/69f1b694abb303ffb5ae7bfccef465c5.jpg"
                  alt="Author Avatar"
                  width={24}
                  height={24}
                  className="size-8 rounded-full"
                />
              )
            )}
            <div className="flex items-center">
              <span className="text-muted-foreground text-sm">Pitithuong</span>
              <Dot className="text-muted-foreground" />
              <span className="text-muted-foreground text-sm">{format(createdAt, 'MMM dd, yyyy')}</span>
            </div>
          </div>
          {variant === 'vertical' && (
            <div
              className={cn('w-fit rounded-full bg-green-100 px-4 py-0.5 text-sm text-green-700', {
                'text-base': isMainPost,
              })}
            >
              {firstTag}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default PostCard;

export const PostCardSkeleton = ({
  variant = 'horizontal',
  isMainPost = false,
  isDisplayExcerpt = false,
  isDisplayAuthorAvatar = false,
  className = '',
}: Props) => {
  return (
    <div
      className={cn(
        'group flex',
        {
          'flex-col': variant === 'vertical',
          'flex-row': variant === 'horizontal',
        },
        className,
      )}
    >
      <div className="flex-1">
        <Skeleton
          className={cn('w-full rounded-lg object-cover', {
            'max-h-[180px]': variant === 'horizontal',
            'max-h-[280px]': variant === 'vertical',
            'max-h-[320px]': isMainPost,
          })}
        />
      </div>
      <div
        className={cn('line-clamp-2 flex flex-1 flex-col justify-between space-y-3 p-4', {
          'space-y-5 py-8': isMainPost,
        })}
      >
        <div
          className={cn('space-y-3', {
            'space-y-5': isMainPost,
          })}
        >
          {variant === 'horizontal' && (
            <Skeleton
              className={cn('h-6 w-24 rounded-full bg-green-100 px-4 py-0.5 text-sm text-green-700', {
                'text-base': isMainPost,
              })}
            />
          )}
          <Skeleton
            className={cn('h-6 rounded bg-gray-200', {
              'h-8': isMainPost,
            })}
          />
          {isMainPost ? (
            <div className="space-y-1">
              <Skeleton className="h-4 rounded bg-gray-200" />
              <Skeleton className="h-4 w-5/6 rounded bg-gray-200" />
            </div>
          ) : (
            isDisplayExcerpt && (
              <div className="space-y-1">
                <Skeleton className="h-4 rounded bg-gray-200" />
                <Skeleton className="h-4 w-5/6 rounded bg-gray-200" />
              </div>
            )
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {isMainPost ? (
              <Skeleton className="size-8 rounded-full" />
            ) : (
              isDisplayAuthorAvatar && <Skeleton className="size-8 rounded-full" />
            )}
            <div className="flex items-center">
              <Skeleton className="h-4 w-20 rounded bg-gray-200" />
              <Dot className="text-muted-foreground" />
              <Skeleton className="ml-2 h-4 w-20 rounded bg-gray-200" />
            </div>
          </div>
          {variant === 'vertical' && (
            <Skeleton
              className={cn('h-6 w-24 rounded-full bg-green-100 px-4 py-0.5 text-sm text-green-700', {
                'text-base': isMainPost,
              })}
            />
          )}
        </div>
      </div>
    </div>
  );
};
