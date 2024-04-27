import { Col, Row, Button } from 'reactstrap';
import GoalsBox from './GoalsBox';
import TasksBox from './TasksBox';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className='dashboard'>
      <h2>Dashboard</h2>
      <Button>START</Button>
      <Row className='row'>
        <Col className='col'>
          <h5>Current Task</h5>
        </Col>
        {/* <Col className='box'>Task Info</Col> */}
      </Row>
      <Row className='row'>
        <Col className='col'>
          <TasksBox />
        </Col>
        <Col className='col'>
          <GoalsBox />
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
