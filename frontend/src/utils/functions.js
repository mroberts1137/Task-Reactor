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
  return arr.reduce((acc, cur) => acc + cur, 0);
};

export const getGoalLines = (goals, maxProgress) => {
  let previousOffset = 0;
  const goalLinesValues = goals?.map((goal) => {
    const goalValue = parseFloat(goal.value);
    const goalPercentage = (goalValue / maxProgress) * 100;
    const offset = previousOffset;
    previousOffset += goalPercentage;

    return {
      offset,
      width: goalPercentage,
      value: goalValue
    };
  });

  return goalLinesValues;
};
