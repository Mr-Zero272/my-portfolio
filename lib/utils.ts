import { clsx, type ClassValue } from 'clsx';
import { format } from 'date-fns';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const createRandomTransId = () => {
  const transID = Math.floor(Math.random() * 1000000);
  return `${format(new Date(), 'yyMMdd')}_${transID}`;
};

export const formatArray = <T>(arr: Array<T>) => {
  if (arr.length === 0) return '';
  if (arr.length === 1) return arr[0];
  return `${arr.slice(0, -1).join(', ')} and ${arr[arr.length - 1]}.`;
};

export const formatSecondsToTime = (seconds: number): string => {
  // Calculate minutes and seconds
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  // Format the time as "m:ss"
  const formattedTime = `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;

  return formattedTime;
};

export const moveElementInArray = <T>(array: T[], oldIndex: number, newIndex: number): T[] => {
  // Check if indices are valid
  if (oldIndex < 0 || oldIndex >= array.length || newIndex < 0 || newIndex >= array.length) {
    throw new Error('Invalid index: indices must be within the array bounds.');
  }

  // Create a copy of the array to avoid mutating the original array
  const newArray = [...array];

  // Remove the element from the old position
  const [element] = newArray.splice(oldIndex, 1);

  // Insert the element at the new position
  newArray.splice(newIndex, 0, element);

  return newArray;
};

export const deleteElementAtIndex = <T>(array: T[], index: number): T[] => {
  // Check if the index is valid
  if (index < 0 || index >= array.length) {
    throw new Error('Invalid index: index must be within the array bounds.');
  }

  // Create a copy of the array to avoid mutating the original array
  const newArray = [...array];

  // Remove the element at the specified index
  newArray.splice(index, 1);

  return newArray;
};
