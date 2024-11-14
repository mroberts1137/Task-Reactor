import React, { useState, useContext, useRef, useEffect } from 'react';
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
  maxH?: number;
}

const MIN_CARD_WIDTH = 2;
const MIN_CARD_HEIGHT = 2;
const ROW_HEIGHT_PX = 45;

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
    }
  );

  const onLayoutChange = (
    currentLayout: LayoutItem[],
    allLayouts: { [key: string]: LayoutItem[] }
  ) => {
    setLayouts(allLayouts);
    localStorage.setItem('dashboardLayouts', JSON.stringify(allLayouts));
  };

  const onToggleMinimize = (cardId: string, isMinimized: boolean) => {
    setLayouts((prevLayouts) => {
      const newLayouts = { ...prevLayouts };
      newLayouts.lg = newLayouts.lg.map((layout) =>
        layout.i === cardId ? { ...layout, h: isMinimized ? 1 : 5 } : layout
      );
      localStorage.setItem('dashboardLayouts', JSON.stringify(newLayouts));
      return newLayouts;
    });
  };

  useEffect(() => {
    const updateLayoutHeights = () => {
      const newLayouts = { ...layouts };
      Object.keys(cardRefs.current).forEach((cardId) => {
        const cardElement = cardRefs.current[cardId];
        if (cardElement) {
          const contentHeight = cardElement.scrollHeight;
          const gridHeight = Math.ceil(contentHeight / ROW_HEIGHT_PX);
          newLayouts.lg = newLayouts.lg.map((layout) =>
            layout.i === cardId ? { ...layout, h: gridHeight } : layout
          );
        }
      });
      setLayouts(newLayouts);
      localStorage.setItem('dashboardLayouts', JSON.stringify(newLayouts));
    };

    updateLayoutHeights();
  }, [layouts]);

  const { todaysDate } = useContext(DateContext);

  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  return (
    <ResponsiveGridLayout
      className='layout'
      layouts={layouts}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
      rowHeight={ROW_HEIGHT_PX}
      onLayoutChange={onLayoutChange}
      draggableHandle='.draggable-handle' // Only drag by header
    >
      <GridItemWrapper
        key='card1'
        ref={(el) => (cardRefs.current['card1'] = el)}
      >
        <Card
          title='Date'
          onToggleMinimize={(isMinimized) =>
            onToggleMinimize('card1', isMinimized)
          }
        >
          <DateDisplay date={todaysDate} />
          <TimeDisplay date={todaysDate} />
        </Card>
      </GridItemWrapper>
      <GridItemWrapper
        key='card2'
        ref={(el) => (cardRefs.current['card2'] = el)}
      >
        <Card
          title='Time Tracking'
          onToggleMinimize={(isMinimized) =>
            onToggleMinimize('card2', isMinimized)
          }
        >
          <TimerBox />
        </Card>
      </GridItemWrapper>
      <GridItemWrapper
        key='card3'
        ref={(el) => (cardRefs.current['card3'] = el)}
      >
        <Card
          title='Progress'
          onToggleMinimize={(isMinimized) =>
            onToggleMinimize('card3', isMinimized)
          }
        >
          <ProgressBox />
        </Card>
      </GridItemWrapper>
      <GridItemWrapper
        key='card4'
        ref={(el) => (cardRefs.current['card4'] = el)}
      >
        <Card
          title='Calendar'
          onToggleMinimize={(isMinimized) =>
            onToggleMinimize('card4', isMinimized)
          }
        >
          <CalendarBox />
        </Card>
      </GridItemWrapper>
      <GridItemWrapper
        key='card5'
        ref={(el) => (cardRefs.current['card5'] = el)}
      >
        <Card
          title='Completed Tasks'
          onToggleMinimize={(isMinimized) =>
            onToggleMinimize('card5', isMinimized)
          }
        >
          <TasksBox />
        </Card>
      </GridItemWrapper>
      <GridItemWrapper
        key='card6'
        ref={(el) => (cardRefs.current['card6'] = el)}
      >
        <Card
          title='Goals'
          onToggleMinimize={(isMinimized) =>
            onToggleMinimize('card6', isMinimized)
          }
        >
          <MonthlyGoalsBox />
          <DailyGoalsBox />
        </Card>
      </GridItemWrapper>
      <GridItemWrapper
        key='card7'
        ref={(el) => (cardRefs.current['card7'] = el)}
      >
        <Card
          title='Manual Task Entry'
          onToggleMinimize={(isMinimized) =>
            onToggleMinimize('card7', isMinimized)
          }
        >
          <AddTask />
        </Card>
      </GridItemWrapper>
    </ResponsiveGridLayout>
  );
};

export default Dashboard;
