import React from 'react';
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
import { lightTheme } from './themes/theme';
import { GlobalStyle } from './themes/globalStyle';
import { Provider } from 'react-redux';
import { store } from './app/store';
// import { PersistGate } from 'redux-persist/integration/react';

function App() {
  return (
    <Provider store={store}>
      {/* <PersistGate loading={null} persistor={persistor}> */}
      <BrowserRouter>
        <ThemeProvider theme={lightTheme}>
          <Header />
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
      {/* </PersistGate> */}
    </Provider>
  );
}

export default App;
