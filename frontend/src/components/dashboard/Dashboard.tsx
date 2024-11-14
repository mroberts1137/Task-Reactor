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
import DailyProgressBox from '../progressbox/DailyProgressBox';
import MonthlyProgressBox from '../progressbox/MonthlyProgressBox';
import CalendarBox from '../calendarbox/CalendarBox';
import DateDisplay from '../DateDisplay';
import TimeDisplay from '../TimeDisplay';
import AddTask from '../list/AddTask';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface LayoutItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
  maxH?: number;
}

const MIN_CARD_WIDTH = 2;
const MIN_CARD_HEIGHT = 2;

const GridItemWrapper = styled.div`
  height: 100%;
`;

const Dashboard: React.FC = () => {
  const [layouts, setLayouts] = useState<{ [key: string]: LayoutItem[] }>(
    () => {
      const savedLayouts = localStorage.getItem('dashboardLayouts');
      return savedLayouts
        ? JSON.parse(savedLayouts)
        : {
            lg: [
              {
                i: 'card1',
                x: 0,
                y: 0,
                w: 4,
                h: 3,
                minW: MIN_CARD_WIDTH,
                minH: MIN_CARD_HEIGHT
              },
              {
                i: 'card2',
                x: 4,
                y: 0,
                w: 4,
                h: 3,
                minW: MIN_CARD_WIDTH,
                minH: MIN_CARD_HEIGHT
              },
              {
                i: 'card3',
                x: 8,
                y: 0,
                w: 4,
                h: 3,
                minW: MIN_CARD_WIDTH,
                minH: MIN_CARD_HEIGHT
              },
              {
                i: 'card4',
                x: 0,
                y: 3,
                w: 4,
                h: 3,
                minW: MIN_CARD_WIDTH,
                minH: MIN_CARD_HEIGHT
              },
              {
                i: 'card5',
                x: 4,
                y: 3,
                w: 4,
                h: 3,
                minW: MIN_CARD_WIDTH,
                minH: MIN_CARD_HEIGHT
              },
              {
                i: 'card6',
                x: 8,
                y: 3,
                w: 4,
                h: 3,
                minW: MIN_CARD_WIDTH,
                minH: MIN_CARD_HEIGHT
              },
              {
                i: 'card7',
                x: 0,
                y: 6,
                w: 4,
                h: 3,
                minW: MIN_CARD_WIDTH,
                minH: MIN_CARD_HEIGHT
              }
            ]
          };
    }
  );

  const onLayoutChange = (
    currentLayout: LayoutItem[],
    allLayouts: { [key: string]: LayoutItem[] }
  ) => {
    setLayouts(allLayouts);
    localStorage.setItem('dashboardLayouts', JSON.stringify(allLayouts));
  };

  const { todaysDate } = useContext(DateContext);

  return (
    <ResponsiveGridLayout
      className='layout'
      layouts={layouts}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
      rowHeight={100}
      onLayoutChange={onLayoutChange}
      draggableHandle='.draggable-handle' // Only drag by header
    >
      <GridItemWrapper key='card1'>
        <Card title='Date'>
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
          <DailyProgressBox />
          <MonthlyProgressBox />
        </Card>
      </GridItemWrapper>
      <GridItemWrapper key='card4'>
        <Card title='Card 4'>
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
