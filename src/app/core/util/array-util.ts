interface Id {
  id: number;
}

export const addOrReplaceItemInArray = <T extends Id>(
  array: T[],
  newOrEditObject: T
): T[] => [
  ...array.filter((o) => o.id !== newOrEditObject.id),
  { ...newOrEditObject },
];
