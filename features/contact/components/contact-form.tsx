'use client';

import { sendMail } from '@/lib/send-mail';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { Button } from '../../../components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../../components/ui/form';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';

export const contactSchema = z.object({
  name: z.string().nonempty({ message: 'This field is required!' }),
  email: z.string().email({ message: 'Invalid email' }).nonempty({ message: 'This field is required!' }),
  phone: z
    .string()
    .regex(new RegExp(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/), { message: 'Invalid phone number' })
    .nonempty({ message: 'This field is required!' }),
  subject: z.string().nonempty({ message: 'This field is required!' }),
  message: z.string().nonempty({ message: 'This field is required!' }),
});

export type contactInfo = z.infer<typeof contactSchema>;

type Props = {
  className?: string;
};

const ContactForm = ({ className = '' }: Props) => {
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

  const submit = async (values: contactInfo) => {
    const mailText = `From ${values.name}, email ${values.email}, phone ${values.phone}\n` + values.message;
    const response = await sendMail({
      email: 'pitithuong@gmail.com',
      sendTo: 'pitithuong@gmail.com',
      subject: values.subject,
      text: mailText,
    });

    if (response?.messageId) {
      toast.success('Thank you for contacting me, I will reply as soon as possible!');
      form.reset();
    } else {
      toast.error('Some thing went wrong, try again later!');
    }
  };
  return (
    <Form {...form}>
      <form className={`${className}`} onSubmit={form.handleSubmit(submit)}>
        <div className="flex flex-col items-center gap-x-4 sm:flex-row">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="mb-5 w-full text-left">
                <FormLabel htmlFor="name" className="text-grey-900 mb-2 text-start text-sm">
                  Name*
                </FormLabel>
                <div className="flex flex-col">
                  <FormControl>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your name"
                      className="no-focus placeholder:text-grey-700 w-full rounded-lg py-6"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="mt-1 text-sm" />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="mb-5 w-full text-left">
                <FormLabel htmlFor="email" className="text-grey-900 mb-2 text-start text-sm">
                  Email*
                </FormLabel>
                <div className="flex flex-col">
                  <FormControl>
                    <Input
                      id="email"
                      type="text"
                      placeholder="Your email"
                      className="no-focus placeholder:text-grey-700 w-full rounded-lg py-6"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="mt-1 text-sm" />
                </div>
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col items-center gap-x-4 sm:flex-row">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="mb-5 w-full text-left">
                <FormLabel htmlFor="phone" className="text-grey-900 mb-2 text-start text-sm">
                  Phone*
                </FormLabel>
                <div className="flex flex-col">
                  <FormControl>
                    <Input
                      id="phone"
                      type="text"
                      placeholder="Your phone"
                      className="no-focus placeholder:text-grey-700 w-full rounded-lg py-6"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="mt-1 text-sm" />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem className="mb-5 w-full text-left">
                <FormLabel htmlFor="subject" className="text-grey-900 mb-2 text-start text-sm">
                  Subject*
                </FormLabel>
                <div className="flex flex-col">
                  <FormControl>
                    <Input
                      id="subject"
                      type="text"
                      placeholder="Your subject*"
                      className="no-focus placeholder:text-grey-700 w-full rounded-lg py-6"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="mt-1 text-sm" />
                </div>
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem className="mb-5 w-full text-left">
              <FormLabel htmlFor="message" className="text-grey-900 mb-2 text-start text-sm">
                Message*
              </FormLabel>
              <div className="flex flex-col">
                <FormControl>
                  <Textarea
                    id="subject"
                    rows={6}
                    placeholder="Your message*"
                    className="no-focus placeholder:text-grey-700 w-full rounded-lg"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="mt-1 text-sm" />
              </div>
            </FormItem>
          )}
        />
        <Button className="mt-2" type="submit" disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Submit'}
        </Button>
      </form>
    </Form>
  );
};

export default ContactForm;
