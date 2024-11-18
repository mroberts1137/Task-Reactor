import React, { useState, useContext } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import styled from 'styled-components';
import Card from './Card';

import { DateContext } from '../../contexts/context';
import DailyGoalsBox from '../goalsbox/DailyGoalsBox';
import MonthlyGoalsBox from '../goalsbox/MonthlyGoalsBox';
import TasksBox from '../taskbox/TasksBox';
import TimerBox from '../timerbox/TimerBox';
import CalendarBox from '../calendarbox/CalendarBox';
import DateDisplay from '../DateDisplay';
import TimeDisplay from '../TimeDisplay';
import AddTask from '../list/AddTask';
import ProgressBox from '../progressbox/ProgressBox';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface LayoutItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
}

const MIN_CARD_WIDTH = 2;
const MIN_CARD_HEIGHT = 2;
const ROW_HEIGHT_PX = 45;

const defaultLayouts = {
  lg: [
    {
      i: 'card1',
      x: 0,
      y: 0,
      w: 6,
      h: 5,
      minW: MIN_CARD_WIDTH,
      minH: MIN_CARD_HEIGHT
    },
    {
      i: 'card2',
      x: 6,
      y: 0,
      w: 6,
      h: 10,
      minW: MIN_CARD_WIDTH,
      minH: MIN_CARD_HEIGHT
    },
    {
      i: 'card3',
      x: 0,
      y: 10,
      w: 6,
      h: 10,
      minW: MIN_CARD_WIDTH,
      minH: MIN_CARD_HEIGHT
    },
    {
      i: 'card4',
      x: 6,
      y: 10,
      w: 6,
      h: 10,
      minW: MIN_CARD_WIDTH,
      minH: MIN_CARD_HEIGHT
    },
    {
      i: 'card5',
      x: 0,
      y: 20,
      w: 6,
      h: 10,
      minW: MIN_CARD_WIDTH,
      minH: MIN_CARD_HEIGHT
    },
    {
      i: 'card6',
      x: 6,
      y: 20,
      w: 6,
      h: 10,
      minW: MIN_CARD_WIDTH,
      minH: MIN_CARD_HEIGHT
    },
    {
      i: 'card7',
      x: 0,
      y: 30,
      w: 6,
      h: 10,
      minW: MIN_CARD_WIDTH,
      minH: MIN_CARD_HEIGHT
    }
  ]
};

const GridItemWrapper = styled.div`
  height: 100%;
`;

const Dashboard: React.FC = () => {
  const [layouts, setLayouts] = useState<{ [key: string]: LayoutItem[] }>(
    () => {
      const savedLayouts = localStorage.getItem('dashboardLayouts');
      return savedLayouts ? JSON.parse(savedLayouts) : defaultLayouts;
    }
  );

  const onLayoutChange = (
    currentLayout: LayoutItem[],
    allLayouts: { [key: string]: LayoutItem[] }
  ) => {
    setLayouts(allLayouts);
    localStorage.setItem('dashboardLayouts', JSON.stringify(allLayouts));
  };

  const resetLayout = () => {
    setLayouts(defaultLayouts);
    localStorage.setItem('dashboardLayouts', JSON.stringify(defaultLayouts));
  };

  const { todaysDate } = useContext(DateContext);

  return (
    <ResponsiveGridLayout
      className='layout'
      layouts={layouts}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
      rowHeight={ROW_HEIGHT_PX}
      onLayoutChange={onLayoutChange}
      draggableHandle='.draggable-handle'
    >
      <GridItemWrapper key='card1'>
        <Card title='Date'>
          <button onClick={resetLayout}>Reset Layout</button>
          <DateDisplay date={todaysDate} />
          <TimeDisplay date={todaysDate} />
        </Card>
      </GridItemWrapper>
      <GridItemWrapper key='card2'>
        <Card title='Time Tracking'>
          <TimerBox />
        </Card>
      </GridItemWrapper>
      <GridItemWrapper key='card3'>
        <Card title='Progress'>
          <ProgressBox />
        </Card>
      </GridItemWrapper>
      <GridItemWrapper key='card4'>
        <Card title='Calendar'>
          <CalendarBox />
        </Card>
      </GridItemWrapper>
      <GridItemWrapper key='card5'>
        <Card title='Completed Tasks'>
          <TasksBox />
        </Card>
      </GridItemWrapper>
      <GridItemWrapper key='card6'>
        <Card title='Goals'>
          <MonthlyGoalsBox />
          <DailyGoalsBox />
        </Card>
      </GridItemWrapper>
      <GridItemWrapper key='card7'>
        <Card title='Manual Task Entry'>
          <AddTask />
        </Card>
      </GridItemWrapper>
    </ResponsiveGridLayout>
  );
};

export default Dashboard;
