import { useRef, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import './RegisterForm.css';
import { setUserId, setUser } from '../app/userSlice';
import { fetchTasks } from '../app/tasksSlice';
import { fetchDailyGoals } from '../app/dailyGoalsSlice';
import { fetchMonthlyGoals } from '../app/monthlyGoalsSlice';
import { auth } from '../auth/auth';
import { Task, Goal, User } from '../types/types';
import { AppDispatch } from '../app/store';

const LOGIN_URL = '/api/auth';

const RegisterForm = () => {
  const dispatch = useDispatch<AppDispatch>();

  const userRef = useRef<HTMLInputElement>(null);
  const errRef = useRef<HTMLParagraphElement>(null);

  const [username, setUsername] = useState('');
  const [userFocus, setUserFocus] = useState(false);

  const [password, setPassword] = useState('');
  const [pwdFocus, setPwdFocus] = useState(false);

  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  // set focus to user input when component loads
  useEffect(() => {
    userRef?.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg('');
  }, [username, password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { user, user_id } = await auth(LOGIN_URL, {
        username,
        password
      });

      // Store the JWT in local storage
      // localStorage.setItem('jwt', response.data.token);

      if (user && user_id) {
        // Set user in state
        dispatch(setUser(user));
        dispatch(setUserId(user_id));

        // Fetch tasks for the logged-in user
        dispatch(fetchTasks({ user_id }));
        dispatch(fetchDailyGoals({ user_id }));
        dispatch(fetchMonthlyGoals({ user_id }));

        // Reset Form
        setSuccess(true);
        setUsername('');
        setPassword('');
      }
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else {
        setErrMsg('Login Failed');
      }
      errRef.current.focus();
    }
  };

  return (
    <div id='register-form'>
      {success ? (
        <section>
          <h1>Success!</h1>
        </section>
      ) : (
        <section>
          <p
            ref={errRef}
            className={errMsg ? 'errmsg' : 'offscreen'}
            aria-live='assertive'
          >
            {errMsg}
          </p>

          <h1>Login</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor='username'>Username:</label>
            <input
              type='text'
              id='username'
              ref={userRef}
              onChange={(e) => setUsername(e.target.value)}
              required
              onFocus={() => setUserFocus(true)}
              onBlur={() => setUserFocus(false)}
            />

            <label htmlFor='password'>Password:</label>
            <input
              type='password'
              id='password'
              onChange={(e) => setPassword(e.target.value)}
              required
              onFocus={() => setPwdFocus(true)}
              onBlur={() => setPwdFocus(false)}
            />

            <button disabled={!username || !password ? true : false}>
              Sign In
            </button>
          </form>

          <p>
            Create an account:
            <br />
            <Link to={'/register'}>Register</Link>
          </p>
        </section>
      )}
    </div>
  );
};

export default RegisterForm;
