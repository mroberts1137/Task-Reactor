import React from 'react';
import ContextProvider from '../contexts/ContextProvider';
import Dashboard from '../components/dashboard/Dashboard';

const DashboardPage = () => {
  return (
    <ContextProvider>
      <Dashboard />
    </ContextProvider>
  );
};

export default DashboardPage;
