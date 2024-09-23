import { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import './RegisterForm.css';
import { setUserId, setUser } from '../app/userSlice';
import { fetchTasks } from '../app/taskSlice';
import { fetchDailyGoals } from '../app/dailyGoalsSlice';
import { fetchMonthlyGoals } from '../app/monthlyGoalsSlice';

const LOGIN_URL = '/api/auth';

const RegisterForm = () => {
  const dispatch = useDispatch();

  const userRef = useRef();
  const errRef = useRef();

  const [username, setUsername] = useState('');
  const [userFocus, setUserFocus] = useState(false);

  const [password, setPassword] = useState('');
  const [pwdFocus, setPwdFocus] = useState(false);

  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  const loggedin_user = useSelector((state) => state.user.user?.username);
  const loggedin_userId = useSelector((state) => state.user.userId);

  // set focus to user input when component loads
  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg('');
  }, [username, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(
        `Submitting credentials to ${axios.defaults.baseURL + LOGIN_URL}`
      );
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ username, password }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );

      console.log(JSON.stringify(response));

      // Store the JWT in local storage
      localStorage.setItem('jwt', response.data.token);

      const user = response.data.user;
      const userId = response.data.user.id;

      dispatch(setUser(user));
      dispatch(setUserId(userId));

      // Fetch tasks for the logged-in user
      dispatch(fetchTasks(userId));
      dispatch(fetchDailyGoals(userId));
      dispatch(fetchMonthlyGoals(userId));

      setSuccess(true);
      setUsername('');
      setPassword('');
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
