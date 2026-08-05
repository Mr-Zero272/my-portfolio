'use client';

import { format } from 'date-fns';
import { CalendarDaysIcon } from 'lucide-react';
import { useState } from 'react';
import { Matcher } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

// ─── Props ────────────────────────────────────────────────────────────────────

interface DatePickerProps {
  /** Giá trị hiện tại dạng ISO string — khớp với format backend trả về */
  value?: string;
  /** Callback trả về ISO string — sẵn sàng gửi lên backend */
  onChange?: (isoString: string) => void;
  /** Placeholder hiển thị khi chưa chọn */
  placeholder?: string;
  /** Disable toàn bộ picker */
  disabled?: boolean;
  /** Ngày nào đó không thể chọn được (ví dụ: disable trước ngày hôm nay) */
  disabledDate?: Matcher | Matcher[] | undefined;
  /** Format hiển thị trên trigger button (default: "MM/dd/yyyy") */
  displayFormat?: string;
  /** Class name cho trigger button */
  className?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Parse ISO string → Date an toàn; trả undefined nếu không hợp lệ */
function parseISO(iso: string | undefined): Date | undefined {
  if (!iso) return undefined;
  const d = new Date(iso);
  return isNaN(d.getTime()) ? undefined : d;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DatePicker({
  value,
  onChange,
  placeholder = 'dd/MM/yyyy',
  disabled = false,
  disabledDate = undefined,
  displayFormat = 'dd/MM/yyyy',
  className,
  ...props
}: DatePickerProps & React.ComponentPropsWithoutRef<'button'>) {
  // Internal state để support uncontrolled usage
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [internalDate, setInternalDate] = useState<Date | undefined>(undefined);

  // Luôn làm việc với Date bên trong component
  const selectedDate = parseISO(value) ?? internalDate;

  function handleDateSelect(date: Date | undefined) {
    if (!date) return;

    if (!value) {
      setInternalDate(date);
    }
    // Trả ra ISO string cho caller
    onChange?.(date.toISOString());
    setPopoverOpen(false);
  }

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            disabled={disabled}
            className={cn(
              'w-full pl-3 text-left font-normal',
              !selectedDate && 'text-muted-foreground',
              className,
            )}
            {...props}
          >
            {selectedDate ? format(selectedDate, displayFormat) : <span>{placeholder}</span>}
            <CalendarDaysIcon
              className={cn('ml-auto h-4 w-4 opacity-50', {
                'opacity-100': selectedDate,
              })}
            />
          </Button>
        }
      />

      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          captionLayout="dropdown"
          mode="single"
          startMonth={new Date('1900-01-01')}
          endMonth={new Date('2100-12-31')}
          disabled={disabledDate}
          selected={selectedDate}
          onSelect={handleDateSelect}
        />
      </PopoverContent>
    </Popover>
  );
}
