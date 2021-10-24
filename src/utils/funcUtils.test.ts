import { findFrom, findIndexFrom } from './funcUtils';

test('test findFrom', () => {
  const arr = [
    { name: 'eliav', age: 25 },
    { name: 'Yosi', age: 35 },
    { name: 'dani', age: 25 },
  ];
  expect(findFrom(arr, (item) => item.age === 25)).toEqual(arr[0]);
  expect(findFrom(arr, (item) => item.age === 25, 1)).toEqual(arr[2]);
  expect(findFrom(arr, (item) => item.name === 'Yosi', 1)).toEqual(arr[1]);
});
test('test findIndexFrom', () => {
  const arr = [
    { name: 'eliav', age: 25 },
    { name: 'Yosi', age: 35 },
    { name: 'dani', age: 25 },
  ];
  expect(findIndexFrom(arr, (item) => item.age === 25)).toEqual(0);
  expect(findIndexFrom(arr, (item) => item.age === 25, 1)).toEqual(2);
  expect(findIndexFrom(arr, (item) => item.name === 'Yosi', 1)).toEqual(1);
});
