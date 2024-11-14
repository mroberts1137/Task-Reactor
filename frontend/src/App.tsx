import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import { Provider } from 'react-redux';
import { store, persistor } from './app/store';
import { useTheme } from './hooks/useTheme';
import { PersistGate } from 'redux-persist/integration/react';

function App() {
  const { theme, isDarkMode, toggleTheme } = useTheme();

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
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
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}

export default App;
