import React, { useContext } from 'react';
import { Col, Row } from 'reactstrap';
// Components
import DailyGoalsBox from '../goalsbox/DailyGoalsBox';
import MonthlyGoalsBox from '../goalsbox/MonthlyGoalsBox';
import TasksBox from '../taskbox/TasksBox';
import TimerBox from '../timerbox/TimerBox';
import DailyProgressBox from '../progressbox/DailyProgressBox';
import MonthlyProgressBox from '../progressbox/MonthlyProgressBox';
import CalendarBox from '../calendarbox/CalendarBox';
import DateDisplay from '../DateDisplay';
import TimeDisplay from '../TimeDisplay';
// Context
import { DateContext } from '../../contexts/context';
// CSS
import './Dashboard.css';
import DebugPanel from '../DebugPanel';

/**
 * Dashboard
 */

const Dashboard: React.FC = () => {
  const { todaysDate } = useContext(DateContext);

  return (
    <div className='dashboard'>
      {/* DEBUG PANEL */}
      <DebugPanel />

      <div className='container'>
        <DateDisplay date={todaysDate} />
        <TimeDisplay date={todaysDate} />
      </div>
      <Row className='row'>
        <TimerBox />
      </Row>
      <Row className='row'>
        <Col className='col'>
          <DailyProgressBox />
          <MonthlyProgressBox />
        </Col>
      </Row>
      <Row>
        <CalendarBox />
      </Row>
      <Row className='row'>
        <TasksBox />
      </Row>
      <Row>
        <MonthlyGoalsBox />
        <DailyGoalsBox />
      </Row>
    </div>
  );
};

export default Dashboard;
