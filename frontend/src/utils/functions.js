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
  if (!arr || arr.length === 0) return 0;
  return arr.reduce((acc, cur) => {
    if (!cur) return acc;
    return acc + cur;
  }, 0);
};
