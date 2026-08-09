import { FieldError } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import { useCallback, useRef } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

export const TitleFormInput = () => {
  const { control } = useFormContext();
  const titleRef = useRef<HTMLTextAreaElement>(null);

  const handleTitleResize = useCallback(() => {
    if (titleRef.current) {
      titleRef.current.style.height = 'auto';
      titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
    }
  }, []);

  return (
    <div className="md:px-20">
      <Controller
        name="title"
        control={control}
        render={({ field, formState }) => (
          <>
            <Textarea
              {...field}
              ref={(el) => {
                field.ref(el);
                titleRef.current = el;
              }}
              onChange={(e) => {
                handleTitleResize();
                field.onChange(e);
              }}
              className="text-foreground min-w-full resize-none border-none px-0 text-3xl font-semibold shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 md:h-14 md:text-4xl dark:bg-transparent"
              placeholder="Post title"
              // onPaste={(e) =>
              //   handlePaste(e, {
              //     onContentDetected: (detectedContent) => {
              //       setValue('content', detectedContent, { shouldDirty: true });
              //     },
              //     onTitleDetected: (detectedTitle) => {
              //       setValue('title', detectedTitle, { shouldDirty: true });
              //       setValue('xMetaTitle', detectedTitle, { shouldDirty: true });
              //       setValue('metaTitle', detectedTitle, { shouldDirty: true });
              //       setTimeout(() => {
              //         handleTitleResize();
              //       }, 300);
              //     },
              //     onContentPlainTextDetected: (plainTextContent) => {
              //       let metaDescription = plainTextContent
              //         .replace(/\n+/g, ' ')
              //         .replace(/\s+/g, ' ')
              //         .trim();
              //       if (plainTextContent.length > 145) {
              //         metaDescription = plainTextContent.slice(0, 142) + '...';
              //       } else {
              //         metaDescription = plainTextContent;
              //       }
              //       setValue('metaDescription', metaDescription, { shouldDirty: true });
              //       setValue('xMetaDescription', metaDescription, { shouldDirty: true });
              //       setValue('excerpt', metaDescription, { shouldDirty: true });
              //     },
              //   })
              // }
            />
            {!formState.isValid && <FieldError errors={[formState.errors.title]} />}
          </>
        )}
      />
    </div>
  );
};
