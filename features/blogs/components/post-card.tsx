import { cn } from '@/lib/utils';
import { Dot } from 'lucide-react';
import Image from 'next/image';

type Props = {
  variant?: 'horizontal' | 'vertical';
  isMainPost?: boolean;
  isDisplayExcerpt?: boolean;
  isDisplayAuthorAvatar?: boolean;
  isHasHoverEffect?: boolean;
  className?: string;
};

const PostCard = ({
  variant = 'horizontal',
  isMainPost = false,
  isDisplayExcerpt = false,
  isDisplayAuthorAvatar = false,
  isHasHoverEffect = false,
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
              Post tag
            </div>
          )}
          <h2
            className={cn('text-lg font-bold', {
              'text-2xl': isMainPost,
              'group-hover:underline': isHasHoverEffect,
            })}
          >
            Post Title
          </h2>
          {isMainPost ? (
            <p className="text-muted-foreground line-clamp-2">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga exercitationem quibusdam blanditiis quam
              ipsum omnis laudantium, rerum sequi at officiis possimus, voluptas consectetur? Facere odit, unde dolorum
              autem maxime quis.
            </p>
          ) : (
            isDisplayExcerpt && (
              <p className="text-muted-foreground line-clamp-2">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga exercitationem quibusdam blanditiis quam
                ipsum omnis laudantium, rerum sequi at officiis possimus, voluptas consectetur? Facere odit, unde
                dolorum autem maxime quis.
              </p>
            )
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
              <span className="text-muted-foreground text-sm">Jan 1, 2024</span>
            </div>
          </div>
          {variant === 'vertical' && (
            <div
              className={cn('w-fit rounded-full bg-green-100 px-4 py-0.5 text-sm text-green-700', {
                'text-base': isMainPost,
              })}
            >
              Post tag
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
