'use client';

import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { Matcher } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

// ─── Props ────────────────────────────────────────────────────────────────────

interface DateTimePicker24hProps {
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
  /** Format hiển thị trên trigger button (default: "MM/dd/yyyy HH:mm") */
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

export function DateTimePicker24h({
  value,
  onChange,
  placeholder = 'dd/MM/yyyy HH:mm',
  disabled = false,
  disabledDate = undefined,
  displayFormat = 'dd/MM/yyyy HH:mm',
  className,
}: DateTimePicker24hProps) {
  // Internal state để support uncontrolled usage
  const [internalDate, setInternalDate] = useState<Date | undefined>(undefined);

  // Luôn làm việc với Date bên trong component
  const selectedDate = parseISO(value) ?? internalDate;

  function updateDate(newDate: Date) {
    if (!value) {
      // uncontrolled: tự quản lý state
      setInternalDate(newDate);
    }
    // Trả ra ISO string cho caller
    onChange?.(newDate.toISOString());
  }

  function handleDateSelect(date: Date | undefined) {
    if (!date) return;

    // Giữ nguyên giờ:phút khi đổi ngày
    const merged = new Date(date);
    if (selectedDate) {
      merged.setHours(selectedDate.getHours());
      merged.setMinutes(selectedDate.getMinutes());
    }
    updateDate(merged);
  }

  function handleTimeChange(type: 'hour' | 'minute', rawValue: string) {
    const base = selectedDate ? new Date(selectedDate) : new Date();
    const next = new Date(base);

    if (type === 'hour') {
      next.setHours(parseInt(rawValue, 10));
    } else {
      next.setMinutes(parseInt(rawValue, 10));
    }

    updateDate(next);
  }

  return (
    <Popover>
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
          >
            {selectedDate ? format(selectedDate, displayFormat) : <span>{placeholder}</span>}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        }
      />

      <PopoverContent className="w-auto p-0">
        <div className="sm:flex">
          {/* ── Calendar ── */}
          <Calendar
            mode="single"
            captionLayout="dropdown"
            startMonth={new Date('1900-01-01')}
            endMonth={new Date('2100-12-31')}
            disabled={disabledDate}
            selected={selectedDate}
            onSelect={handleDateSelect}
          />

          {/* ── Time columns ── */}
          <div className="flex flex-col divide-y sm:h-[300px] sm:flex-row sm:divide-x sm:divide-y-0">
            {/* Hours */}
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex p-2 sm:flex-col">
                {Array.from({ length: 24 }, (_, i) => i)
                  .reverse()
                  .map((hour) => (
                    <Button
                      key={hour}
                      size="icon"
                      variant={
                        selectedDate && selectedDate.getHours() === hour ? 'default' : 'ghost'
                      }
                      className="aspect-square shrink-0 sm:w-full"
                      onClick={() => handleTimeChange('hour', hour.toString())}
                    >
                      {hour}
                    </Button>
                  ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>

            {/* Minutes (step 5) */}
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex p-2 sm:flex-col">
                {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                  <Button
                    key={minute}
                    size="icon"
                    variant={
                      selectedDate && selectedDate.getMinutes() === minute ? 'default' : 'ghost'
                    }
                    className="aspect-square shrink-0 sm:w-full"
                    onClick={() => handleTimeChange('minute', minute.toString())}
                  >
                    {minute.toString().padStart(2, '0')}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
