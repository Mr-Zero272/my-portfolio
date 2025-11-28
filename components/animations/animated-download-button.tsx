'use client';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import axios from 'axios';
import { Circle, CircleCheck, CircleX, Download } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useMemo, useState } from 'react';

interface MyButtonProps extends ButtonProps {
  urlDownload: string;
  label?: string;
}

const AnimatedDownloadButton = ({ urlDownload, label = 'Download My CV', ...rest }: MyButtonProps) => {
  const [status, setStatus] = useState('idle');
  const variants = useMemo(
    () => ({
      initial: { opacity: 0, y: 15 },
      show: { opacity: 100, y: 0, transition: { delay: 0.1, duration: 0.4 } },
      hidden: { opacity: 0, y: -15, transition: { duration: 0.3 } },
    }),
    [],
  );

  const handleSubmit = async () => {
    try {
      setStatus('loading');
      await new Promise((res) => setTimeout(res, 2000));
      const response = await axios.get(urlDownload, {
        responseType: 'blob', // Important for binary data
      });

      // Extract filename from content-disposition header
      const contentDisposition = response.headers['content-disposition'];
      const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
      const fileName = fileNameMatch ? fileNameMatch[1] : 'downloadedFile';

      // Create a temporary anchor element to trigger the download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      // Setting filename received in response
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setStatus('success');
    } catch (error) {
      console.error('Error downloading file:', error);
      setStatus('error');
    } finally {
      setTimeout(() => {
        setStatus('idle');
      }, 3500);
    }
  };
  return (
    <Button
      disabled={status == 'loading'}
      onClick={handleSubmit}
      {...rest}
      variant={status === 'error' ? 'destructive' : rest.variant}
      className={cn('w-44 gap-2 overflow-hidden rounded-lg', rest.className)}
    >
      <span key="label">{status === 'idle' ? label : status == 'loading' ? 'Pending...' : 'Completed'}</span>
      <AnimatePresence mode="wait">
        {status === 'idle' ? (
          <motion.span key={status} variants={variants} initial={'initial'} animate={'show'} exit={'hidden'}>
            <Download className="size-4" />
          </motion.span>
        ) : status === 'loading' ? (
          <motion.span key={status} variants={variants} initial={'initial'} animate={'show'} exit={'hidden'}>
            <Circle className="size-4 animate-spin" />
          </motion.span>
        ) : (
          <motion.span key={status} variants={variants} initial={'initial'} animate={'show'} exit={'hidden'}>
            {status === 'success' && <CircleCheck className="size-4" />}
            {status === 'error' && <CircleX className="size-4" />}
          </motion.span>
        )}
      </AnimatePresence>
    </Button>
  );
};

export default AnimatedDownloadButton;
