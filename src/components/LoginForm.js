import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import './RegisterForm.css';

const LOGIN_URL = '/login';

const RegisterForm = () => {
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState('');
  const [userFocus, setUserFocus] = useState(false);

  const [pwd, setPwd] = useState('');
  const [pwdFocus, setPwdFocus] = useState(false);

  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  // set focus to user input when component loads
  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg('');
  }, [user, pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ username: user, password: pwd }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );
      console.log(JSON.stringify(response));

      setSuccess(true);
      setUser('');
      setPwd('');
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

          <h1>Log In</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor='username'>Username:</label>
            <input
              type='text'
              id='username'
              ref={userRef}
              onChange={(e) => setUser(e.target.value)}
              required
              onFocus={() => setUserFocus(true)}
              onBlur={() => setUserFocus(false)}
            />

            <label htmlFor='password'>Password:</label>
            <input
              type='password'
              id='password'
              onChange={(e) => setPwd(e.target.value)}
              required
              onFocus={() => setPwdFocus(true)}
              onBlur={() => setPwdFocus(false)}
            />

            <button disabled={!user || !pwd ? true : false}>Sign Up</button>
          </form>

          <p>
            Create an account:
            <br />
            <Link to={'/register'}>
              <p>Register</p>
            </Link>
          </p>
        </section>
      )}
    </div>
  );
};

export default RegisterForm;
