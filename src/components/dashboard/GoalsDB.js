const GoalsDB = () => {
  const goals = [
    {
      title: 'goal 1',
      value: 80
    },
    {
      title: 'goal 2',
      value: 90
    },
    {
      title: 'goal 3',
      value: 100
    }
  ];
  return (
    <>
      <h4>Goals</h4>
      <ul>
        {goals.map((goal) => (
          <li>
            {goal.title}${goal.value}
          </li>
        ))}
      </ul>
    </>
  );
};

export default GoalsDB;
