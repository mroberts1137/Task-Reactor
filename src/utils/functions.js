export const month = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'June',
  'July',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec'
];

export const sumTotal = (arr) => {
  return arr
    .map((item) => parseFloat(item.value))
    .reduce((acc, cur) => acc + cur, 0);
};
