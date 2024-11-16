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

export const sumTotal = (items: number[] | undefined): number => {
  return items && items.length > 0
    ? items.reduce((sum, item) => sum + (item || 0), 0)
    : 0;
};
