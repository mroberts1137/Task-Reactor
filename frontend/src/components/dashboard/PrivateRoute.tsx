import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';

const PrivateRoute = () => {
  const userId = useSelector((state: RootState) => state.user.userId);

  return userId ? <Outlet /> : <Navigate to='/' replace />;
};

export default PrivateRoute;
