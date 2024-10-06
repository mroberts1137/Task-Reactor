import ContextProvider from '../contexts/ContextProvider';
import Dashboard from '../components/dashboard/Dashboard';

const HomePage = () => {
  return (
    <ContextProvider>
      <Dashboard />
    </ContextProvider>
  );
};

export default HomePage;
