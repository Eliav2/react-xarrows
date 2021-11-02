export const findFrom = <T>(arr: T[], func: (item: T) => boolean, startIndex = 0): T | null => {
  for (let i = startIndex; i < arr.length; i++) {
    if (func(arr[i])) return arr[i];
  }
  return null;
};

export const findIndexFrom = <T>(arr: T[], func: (item: T) => boolean, startIndex = 0): number | null => {
  for (let i = startIndex; i < arr.length; i++) {
    if (func(arr[i])) return i;
  }
  return null;
};
