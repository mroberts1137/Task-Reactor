import { useRef, useState, useEffect, FormEvent } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  faCheck,
  faTimes,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './RegisterForm.css';
import { register } from '../app/userSlice';
import { AppDispatch } from '../app/store';

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const RegisterForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const userRef = useRef<HTMLInputElement>(null);
  const errRef = useRef<HTMLParagraphElement>(null);

  const [username, setUsername] = useState('');
  const [validUsername, setValidUsername] = useState(false);
  const [usernameFocus, setUsernameFocus] = useState(false);

  const [password, setPassword] = useState('');
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [matchPassword, setMatchPassword] = useState('');
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  // set focus to user input when component loads
  useEffect(() => {
    userRef.current?.focus();
  }, []);

  // check if username is valid
  useEffect(() => {
    setValidUsername(USER_REGEX.test(username));
  }, [username]);

  // check if password is valid and matches
  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password));
    setValidMatch(password === matchPassword);
  }, [password, matchPassword]);

  useEffect(() => {
    setErrMsg('');
  }, [username, password, matchPassword]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!USER_REGEX.test(username) || !PWD_REGEX.test(password)) {
      setErrMsg('Invalid Entry');
      return;
    }

    try {
      dispatch(
        register({
          username,
          password
        })
      );

      // Reset Form
      setSuccess(true);
      setUsername('');
      setPassword('');
      setMatchPassword('');

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (err: any) {
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 409) {
        setErrMsg('Username already taken');
      } else {
        setErrMsg('Registration Failed');
      }
      errRef.current?.focus();
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

          <h1>Register</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor='username'>
              Username:
              <span className={validUsername ? 'valid' : 'hide'}>
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span className={validUsername || !username ? 'hide' : 'invalid'}>
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </label>
            <input
              type='text'
              id='username'
              ref={userRef}
              autoComplete='off'
              onChange={(e) => setUsername(e.target.value)}
              required
              aria-invalid={validUsername ? 'false' : 'true'}
              aria-describedby='uidnote'
              onFocus={() => setUsernameFocus(true)}
              onBlur={() => setUsernameFocus(false)}
            />
            <p
              id='uidnote'
              className={
                usernameFocus && username && !validUsername
                  ? 'instructions'
                  : 'offscreen'
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              4 to 24 characters.
              <br />
              Must begin with a letter.
              <br />
              Letters, numbers, underscores, hyphens allowed.
            </p>

            <label htmlFor='password'>
              Password:
              <span className={validPassword ? 'valid' : 'hide'}>
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span className={validPassword || !password ? 'hide' : 'invalid'}>
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </label>
            <input
              type='password'
              id='password'
              onChange={(e) => setPassword(e.target.value)}
              required
              aria-invalid={validPassword ? 'false' : 'true'}
              aria-describedby='pwdnote'
              onFocus={() => setPasswordFocus(true)}
              onBlur={() => setPasswordFocus(false)}
            />
            <p
              id='pwdnote'
              className={
                passwordFocus && !validPassword ? 'instructions' : 'offscreen'
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              8 to 24 characters.
              <br />
              Must include uppercase and lowercase letters, a number, and a
              special character.
              <br />
              Allowed special characters:{' '}
              <span aria-label='exclamation mark'>!</span>{' '}
              <span aria-label='at symbol'>@</span>{' '}
              <span aria-label='hashtag'>#</span>{' '}
              <span aria-label='dollar sign'>$</span>{' '}
              <span aria-label='percent'>%</span>
            </p>

            <label htmlFor='confirm_pwd'>
              Confirm Password:
              <span className={validMatch && matchPassword ? 'valid' : 'hide'}>
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span
                className={validMatch || !matchPassword ? 'hide' : 'invalid'}
              >
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </label>
            <input
              type='password'
              id='confirm_pwd'
              onChange={(e) => setMatchPassword(e.target.value)}
              required
              aria-invalid={validMatch ? 'false' : 'true'}
              aria-describedby='confirmnote'
              onFocus={() => setMatchFocus(true)}
              onBlur={() => setMatchFocus(false)}
            />
            <p
              id='confirmnote'
              className={
                matchFocus && !validMatch ? 'instructions' : 'offscreen'
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              Must match the first password input field.
            </p>

            <button disabled={!validUsername || !validPassword || !validMatch}>
              Sign Up
            </button>
          </form>

          <p>
            Already registered?
            <br />
            <Link to={'/login'}>Login</Link>
          </p>
        </section>
      )}
    </div>
  );
};

export default RegisterForm;
