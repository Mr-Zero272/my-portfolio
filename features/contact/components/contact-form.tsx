'use client';

import { FormInput, FormRichText } from '@/components/forms';
import { lexicalJsonToHtml } from '@/components/ui/rich-text-editor';
import { Spinner } from '@/components/ui/spinner';
import { env } from '@/config/env';
import { sendMail } from '@/lib/send-mail';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { SendIcon } from 'lucide-react';
import { parseAsString, useQueryStates } from 'nuqs';
import { useCallback, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { Button } from '../../../components/ui/button';

/**
 * Presets applied when the contact form is opened with `?source=<key>`.
 *
 * `message` is intentionally NOT prefilled here — the field is a rich text
 * editor that stores a Lexical JSON string, so the sender composes it in the UI.
 */
const CONTACT_SOURCE_PRESETS: Record<string, { subject: string; message: string }> = {
  'hire-me': {
    subject: 'Interested in working together.',
    message:
      '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Hi,","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"I came across your portfolio and I’m interested in discussing a potential opportunity with you.","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"I’d be happy to share more details about the role/project and learn more about your availability and experience.","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Please feel free to get in touch at your convenience.","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Best regards,","type":"text","version":1},{"type":"linebreak","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":"[Your Name]","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""}],"direction":null,"format":"","indent":0,"type":"root","version":1}}',
  },
};

const useContactSourceParam = () => {
  const [{ source }] = useQueryStates({
    source: parseAsString.withDefault(''),
  });

  return source;
};

/** Convert Lexical-generated HTML to plain text (text alternative of the mail). */
const htmlToPlainText = (html: string) =>
  html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(?:p|div|h[1-6]|li|blockquote|ul|ol)>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .join('\n')
    .trim();

/** `message` is a Lexical JSON string — treat it as empty when it has no visible text. */
const isRichTextEmpty = (lexicalJson?: string) => {
  if (!lexicalJson) return true;
  try {
    return htmlToPlainText(lexicalJsonToHtml(lexicalJson)).length === 0;
  } catch {
    return true;
  }
};

/** Escape user input before embedding it into the HTML mail body. */
const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const contactSchema = z.object({
  name: z.string().nonempty({ message: 'This field is required!' }),
  email: z.email({ message: 'Invalid email' }).nonempty({ message: 'This field is required!' }),
  phone: z
    .string()
    .regex(new RegExp(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/), {
      message: 'Invalid phone number',
    })
    .nonempty({ message: 'This field is required!' }),
  subject: z.string().nonempty({ message: 'This field is required!' }),
  // Message is stored as Lexical JSON — content is validated by isRichTextEmpty.
  message: z
    .string()
    .refine((value) => !isRichTextEmpty(value), { message: 'This field is required!' }),
});

type contactInfo = z.infer<typeof contactSchema>;

type Props = {
  className?: string;
};

export const ContactForm = ({ className = '' }: Props) => {
  const source = useContactSourceParam();
  const preset = source ? CONTACT_SOURCE_PRESETS[source] : undefined;

  // RichTextEditor only seeds its content from `value` on first mount, so bump
  // this key after a successful send to clear the editor together with reset().
  const [messageEditorKey, setMessageEditorKey] = useState(0);

  const form = useForm<contactInfo>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: preset?.subject ?? '',
      message: preset?.message ?? '',
    },
  });

  const isLoading = form.formState.isSubmitting;

  const submit = useCallback(
    async (values: contactInfo) => {
      // `message` is a Lexical JSON string — render it to HTML at send time.
      const messageHtml = lexicalJsonToHtml(values.message);
      const messageText = htmlToPlainText(messageHtml);

      const senderHeader = `From: ${values.name}\nEmail: ${values.email}\nPhone: ${values.phone}\n`;

      const response = await sendMail({
        email: env.PUBLIC_MAIL_TO,
        sendTo: env.PUBLIC_MAIL_TO,
        subject: values.subject,
        text: `${senderHeader}\n${messageText}`,
        // HTML body rendered from the rich text content.
        html: `<p><strong>Name:</strong> ${escapeHtml(values.name)}<br/><strong>Email:</strong> ${escapeHtml(values.email)}<br/><strong>Phone:</strong> ${escapeHtml(values.phone)}</p><hr/>${messageHtml}`,
      });

      if (response?.messageId) {
        toast.success('Thank you for contacting me', {
          description: 'I will reply as soon as possible!',
        });
        form.reset({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
        setMessageEditorKey((key) => key + 1);
      } else {
        toast.error('Some thing went wrong', {
          description: 'Try again later!',
        });
      }
    },
    [form],
  );

  return (
    <FormProvider {...form}>
      <form className={cn('space-y-4', className)} onSubmit={form.handleSubmit(submit)}>
        <div className="flex flex-col gap-4 sm:flex-row">
          <FormInput name="name" placeholder="Your name" label="Name" required />
          <FormInput name="email" placeholder="Your email" label="Email" required />
        </div>
        <div className="flex flex-col gap-4 sm:flex-row">
          <FormInput name="phone" placeholder="Your phone" label="Phone" required />
          <FormInput name="subject" placeholder="Your subject" label="Subject" required />
        </div>
        <FormRichText
          key={messageEditorKey}
          name="message"
          label="Message"
          placeholder="Write your message..."
          description="You can format the message (bold, lists, headings...) before sending."
          required
        />
        <Button className="mt-2" type="submit" disabled={isLoading}>
          {isLoading ? <Spinner /> : <SendIcon />}
          {isLoading ? 'Sending...' : 'Submit'}
        </Button>
      </form>
    </FormProvider>
  );
};
