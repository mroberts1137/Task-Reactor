import { useSelector } from 'react-redux';
import DebugPanel from '../components/DebugPanel';
import { selectUser } from '../app/userSlice';

const SettingsPage = () => {
  const user = useSelector(selectUser);

  return (
    <div className='settings-page'>
      <h1>Settings</h1>
      {user && user?.admin && <DebugPanel />}
    </div>
  );
};

export default SettingsPage;
