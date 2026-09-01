'use client';

import { FormInput, FormTextArea } from '@/components/forms';
import { Spinner } from '@/components/ui/spinner';
import { sendMail } from '@/lib/send-mail';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { SendIcon } from 'lucide-react';
import { useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { Button } from '../../../components/ui/button';

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
  message: z.string().nonempty({ message: 'This field is required!' }),
});

type contactInfo = z.infer<typeof contactSchema>;

type Props = {
  className?: string;
};

export const ContactForm = ({ className = '' }: Props) => {
  const form = useForm<contactInfo>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    },
  });

  const isLoading = form.formState.isSubmitting;

  const submit = useCallback(
    async (values: contactInfo) => {
      const mailText =
        `From ${values.name}, email ${values.email}, phone ${values.phone}\n` + values.message;
      const response = await sendMail({
        email: 'pitithuong@gmail.com',
        sendTo: 'pitithuong@gmail.com',
        subject: values.subject,
        text: mailText,
      });

      if (response?.messageId) {
        toast.success('Thank you for contacting me', {
          description: 'I will reply as soon as possible!',
        });
        form.reset();
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
        <div className="flex flex-col items-center gap-x-4 sm:flex-row">
          <FormInput name="name" placeholder="Your name" label="Name" required />
          <FormInput name="email" placeholder="Your email" label="Email" required />
        </div>
        <div className="flex flex-col items-center gap-x-4 sm:flex-row">
          <FormInput name="phone" placeholder="Your phone" label="Phone" required />
          <FormInput name="subject" placeholder="Your subject" label="Subject" required />
        </div>
        <FormTextArea name="message" placeholder="Your message" label="Message" required />
        <Button className="mt-2" type="submit" disabled={isLoading}>
          {isLoading ? <Spinner /> : <SendIcon />}
          {isLoading ? 'Sending...' : 'Submit'}
        </Button>
      </form>
    </FormProvider>
  );
};
