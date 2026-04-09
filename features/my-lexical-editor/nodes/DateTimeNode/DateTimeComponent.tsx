/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { JSX } from 'react';

import 'react-day-picker/style.css';
import './DateTimeNode.css';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection';
import { setHours, setMinutes } from 'date-fns';
import { $getNodeByKey, IS_BOLD, IS_HIGHLIGHT, IS_ITALIC, IS_STRIKETHROUGH, IS_UNDERLINE, NodeKey } from 'lexical';
import * as React from 'react';
import { useState } from 'react';

import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

import { $isDateTimeNode, type DateTimeNode } from './DateTimeNode';

const FORMAT_CLASSES = [
  [IS_BOLD, 'dateTimePill--bold'],
  [IS_HIGHLIGHT, 'dateTimePill--highlight'],
  [IS_ITALIC, 'dateTimePill--italic'],
  [IS_STRIKETHROUGH, 'dateTimePill--strikethrough'],
  [IS_UNDERLINE, 'dateTimePill--underline'],
] as const;

const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export default function DateTimeComponent({
  dateTime,
  format,
  nodeKey,
}: {
  dateTime: Date | undefined;
  format: number;
  nodeKey: NodeKey;
}): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(dateTime);
  const [includeTime, setIncludeTime] = useState(() => {
    if (dateTime === undefined) return false;
    const hours = dateTime?.getHours();
    const minutes = dateTime?.getMinutes();
    return hours !== 0 || minutes !== 0;
  });
  const [timeValue, setTimeValue] = useState(() => {
    if (dateTime === undefined) return '00:00';
    const hours = dateTime?.getHours();
    const minutes = dateTime?.getMinutes();
    if (hours !== 0 || minutes !== 0) {
      return `${hours?.toString().padStart(2, '0')}:${minutes?.toString().padStart(2, '0')}`;
    }
    return '00:00';
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isNodeSelected, setNodeSelected, clearNodeSelection] = useLexicalNodeSelection(nodeKey);

  const withDateTimeNode = (cb: (node: DateTimeNode) => void, onUpdate?: () => void): void => {
    editor.update(
      () => {
        const node = $getNodeByKey(nodeKey);
        if ($isDateTimeNode(node)) {
          cb(node);
        }
      },
      { onUpdate },
    );
  };

  const handleCheckboxChange = (checked: boolean) => {
    withDateTimeNode((node) => {
      if (checked) {
        setIncludeTime(true);
      } else {
        if (selected) {
          const newSelectedDate = setHours(setMinutes(selected, 0), 0);
          node.setDateTime(newSelectedDate);
        }
        setIncludeTime(false);
        setTimeValue('00:00');
      }
    });
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    withDateTimeNode((node) => {
      const time = e.target.value;
      if (!selected) {
        setTimeValue(time);
        return;
      }
      const [hours, minutes] = time.split(':').map((str: string) => parseInt(str, 10));
      const newSelectedDate = setHours(setMinutes(selected, minutes), hours);
      setSelected(newSelectedDate);
      node.setDateTime(newSelectedDate);
      setTimeValue(time);
    });
  };

  const handleDaySelect = (date: Date | undefined) => {
    withDateTimeNode((node) => {
      if (!timeValue || !date) {
        setSelected(date);
        return;
      }
      const [hours, minutes] = timeValue.split(':').map((str) => parseInt(str, 10));
      const newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes);
      node.setDateTime(newDate);
      setSelected(newDate);
    });
  };

  // Build format flags into CSS class names
  const formatClassNames: string[] = [];
  for (const [flag, className] of FORMAT_CLASSES) {
    if (format & flag) {
      formatClassNames.push(className);
    }
  }

  const pillLabel = dateTime?.toDateString() + (includeTime ? ' ' + timeValue : '') || 'Invalid Date';

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {/*
         * We render a plain <span> here (not a shadcn Button) so the pill
         * sits inline inside Lexical's contenteditable without breaking the
         * block-level flow a <button> would introduce.
         */}
        <span
          className={cn(
            // Base pill styles
            'dateTimePill',
            'inline-block cursor-pointer rounded-lg border border-[#ddd] bg-[#ddd] select-none',
            'px-1 py-0 text-sm leading-snug',
            'hover:border-[#f2f2f2] hover:bg-[#f2f2f2]',
            'transition-colors duration-150',
            // Lexical node-selected ring
            isNodeSelected && 'outline-2 outline-[rgb(60,132,244)]',
            // Text-format modifiers (kept as CSS classes so Lexical can toggle them)
            ...formatClassNames,
          )}
        >
          {pillLabel}
        </span>
      </PopoverTrigger>

      <PopoverContent
        className={cn('dateTimePicker', 'w-auto p-0 shadow-lg')}
        align="start"
        side="bottom"
        sideOffset={5}
      >
        {/*
         * shadcn Calendar wraps react-day-picker and forwards all DayPicker
         * props, so the behaviour is identical to the original.
         */}
        <Calendar
          captionLayout="dropdown"
          navLayout="after"
          fixedWeeks={false}
          showOutsideDays={false}
          mode="single"
          selected={selected}
          required={true}
          onSelect={handleDaySelect}
          startMonth={new Date(1925, 0)}
          endMonth={new Date(2042, 7)}
        />

        {/* Time section */}
        <div className="border-t border-border px-3 pt-2 pb-3">
          <div className="flex items-center gap-2">
            <Checkbox id="datetime-include-time" checked={includeTime} onCheckedChange={handleCheckboxChange} />
            <Label htmlFor="datetime-include-time" className="flex cursor-pointer items-center gap-2">
              <input
                type="time"
                value={timeValue}
                onChange={handleTimeChange}
                disabled={!includeTime}
                className={cn(
                  'rounded border border-input bg-background px-2 py-0.5 text-sm',
                  'focus:ring-2 focus:ring-ring focus:ring-offset-1 focus:outline-none',
                  'disabled:cursor-not-allowed disabled:opacity-50',
                  'transition-opacity duration-150',
                )}
              />
              <span className="truncate text-xs text-muted-foreground">{userTimeZone}</span>
            </Label>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
