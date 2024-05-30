import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Col, Row, Button } from 'reactstrap';
import GoalsBox from './GoalsBox';
import TasksBox from './TasksBox';
import TimerBox from './TimerBox';
import ProgressBox from './ProgressBox';
import './Dashboard.css';
import { selectAllGoals } from '../../app/goalsReducer';
import { selectAllTasks } from '../../app/taskReducer';
import SaveLoadButtons from '../SaveLoadButtons.js';
import SaveLoad from '../SaveLoad.js';

const Dashboard = () => {
  const goals = useSelector(selectAllGoals);
  const tasks = useSelector(selectAllTasks);

  const [goalsTotal, setGoalsTotal] = useState(0);
  const [tasksTotal, setTasksTotal] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);

  const sumTotal = (arr) => {
    return arr
      .map((item) => parseFloat(item.value))
      .reduce((acc, cur) => acc + cur, 0);
  };

  useEffect(() => {
    setGoalsTotal(sumTotal(goals));
  }, [goals]);

  useEffect(() => {
    setTasksTotal(sumTotal(tasks));
  }, [tasks]);

  useEffect(() => {
    setTotalEarnings(tasksTotal + earnings);
  }, [tasksTotal, earnings]);

  return (
    <div className='dashboard'>
      <Row className='row'>
        <Col className='col'>
          <TimerBox earningsChange={(val) => setEarnings(val)} />
          {/* <SaveLoadButtons />
          <SaveLoad /> */}
        </Col>
      </Row>
      <Row className='row'>
        <Col className='col'>
          <ProgressBox goalsTotal={goalsTotal} totalEarnings={totalEarnings} />
        </Col>
      </Row>
      <Row className='row'>
        <Col className='col'>
          <TasksBox total={tasksTotal} />
        </Col>
        <Col className='col'>
          <GoalsBox total={goalsTotal} />
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
