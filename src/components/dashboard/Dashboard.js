import { Col, Row, Button } from 'reactstrap';
import GoalsDB from './GoalsDB';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className='dashboard'>
      <h2>Dashboard</h2>
      <Button>START</Button>
      <Row className='row'>
        <Col className='col'>Current Task Info</Col>
        {/* <Col className='box'>Task Info</Col> */}
      </Row>
      <Row className='row'>
        <Col className='col'>Current Task Info</Col>
        <Col className='col'>
          <GoalsDB />
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
