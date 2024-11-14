import { Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import DashboardPage from './pages/DashboardPage';
import PrivateRoute from './components/dashboard/PrivateRoute';
import { ThemeProvider } from 'styled-components';
import GlobalStyle from './styles/themes/globalStyle';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from './app/store';
import { useTheme } from './hooks/useTheme';
import { useEffect } from 'react';
import { clearUser, selectUserId } from './app/userSlice';
import { verifySession } from './auth/auth';

function App() {
  const { theme, isDarkMode, toggleTheme } = useTheme();

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const userId = useSelector(selectUserId);

  useEffect(() => {
    const checkSession = async () => {
      console.log('Running checkSession...');
      if (userId) {
        console.log('Verifying session...');
        // Dispatch an action to verify the session using the JWT from cookies
        const validSession = await dispatch(verifySession()).unwrap();

        if (validSession) {
          console.log('Session verified!');
          navigate('/dashboard'); // Redirect to dashboard if session is valid
        } else {
          console.log('Session not verified!');
          dispatch(clearUser()); // Clear the user data if the token is invalid
          navigate('/'); // Redirect to HomePage if session is invalid
        }
      }
    };

    // checkSession();
  }, [userId, dispatch, navigate]);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path='/dashboard' element={<DashboardPage />} />
          <Route path='/profile' element={<ProfilePage />} />
          <Route path='/settings' element={<SettingsPage />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
