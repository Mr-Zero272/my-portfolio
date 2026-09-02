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