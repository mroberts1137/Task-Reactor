import React, { useRef, useState, useEffect, FormEvent } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faTimes,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import {
  FormContainer,
  FormSection,
  Form,
  Label,
  Input,
  Button,
  StyledLink,
  ErrorMessage,
  Instructions,
  ValidationIcon
} from '../styles/components/AuthForms';
import { AppDispatch } from '../app/store';
import { register } from '../app/userSlice';

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const RegisterForm: React.FC = () => {
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
      await dispatch(
        register({
          username,
          password
        })
      ).unwrap();

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
    <FormContainer>
      {success ? (
        <FormSection>
          <h1>Success!</h1>
        </FormSection>
      ) : (
        <FormSection>
          <ErrorMessage show={!!errMsg} ref={errRef} aria-live='assertive'>
            {errMsg}
          </ErrorMessage>

          <h1>Register</h1>
          <Form onSubmit={handleSubmit}>
            <Label htmlFor='username'>
              Username:
              <ValidationIcon valid={validUsername} hide={!username}>
                <FontAwesomeIcon icon={validUsername ? faCheck : faTimes} />
              </ValidationIcon>
            </Label>
            <Input
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
            <Instructions
              id='uidnote'
              show={usernameFocus && username && !validUsername}
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              4 to 24 characters.
              <br />
              Must begin with a letter.
              <br />
              Letters, numbers, underscores, hyphens allowed.
            </Instructions>

            <Label htmlFor='password'>
              Password:
              <span className={validPassword ? 'valid' : 'hide'}>
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span className={validPassword || !password ? 'hide' : 'invalid'}>
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </Label>
            <Input
              type='password'
              id='password'
              onChange={(e) => setPassword(e.target.value)}
              required
              aria-invalid={validPassword ? 'false' : 'true'}
              aria-describedby='pwdnote'
              onFocus={() => setPasswordFocus(true)}
              onBlur={() => setPasswordFocus(false)}
            />
            <Instructions id='pwdnote' show={passwordFocus && !validPassword}>
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
            </Instructions>

            <Label htmlFor='confirm_pwd'>
              Confirm Password:
              <span className={validMatch && matchPassword ? 'valid' : 'hide'}>
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span
                className={validMatch || !matchPassword ? 'hide' : 'invalid'}
              >
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </Label>
            <Input
              type='password'
              id='confirm_pwd'
              onChange={(e) => setMatchPassword(e.target.value)}
              required
              aria-invalid={validMatch ? 'false' : 'true'}
              aria-describedby='confirmnote'
              onFocus={() => setMatchFocus(true)}
              onBlur={() => setMatchFocus(false)}
            />
            <Instructions id='confirmnote' show={matchFocus && !validMatch}>
              <FontAwesomeIcon icon={faInfoCircle} />
              Must match the first password input field.
            </Instructions>

            <Button disabled={!validUsername || !validPassword || !validMatch}>
              Sign Up
            </Button>
          </Form>

          <p>
            Already registered?
            <br />
            <StyledLink to='/login'>Login</StyledLink>
          </p>
        </FormSection>
      )}
    </FormContainer>
  );
};

export default RegisterForm;
