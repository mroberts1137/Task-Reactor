import React, { useRef, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  FormContainer,
  FormSection,
  Form,
  Label,
  Input,
  Button,
  StyledLink,
  ErrorMessage
} from '../styles/components/AuthForms';
import { AppDispatch } from '../app/store';
import { login } from '../app/userSlice';
import ErrorBoundary from './ErrorBoundary';

const LoginForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const userRef = useRef<HTMLInputElement>(null);
  const errRef = useRef<HTMLParagraphElement>(null);

  const [username, setUsername] = useState('');
  // eslint-disable-next-line
  const [userFocus, setUserFocus] = useState(false);

  const [password, setPassword] = useState('');
  // eslint-disable-next-line
  const [pwdFocus, setPwdFocus] = useState(false);

  const [errMsg, setErrMsg] = useState('');
  // eslint-disable-next-line
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
      await dispatch(
        login({
          username,
          password
        })
      ).unwrap();

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (err: any) {
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 400) {
        setErrMsg('Missing Username or Password');
      } else if (err.response?.status === 401) {
        setErrMsg('Unauthorized');
      } else {
        setErrMsg('Login Failed');
      }
      errRef.current?.focus();
    }
  };

  return (
    <ErrorBoundary>
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

            <h1>Login</h1>
            <Form onSubmit={handleSubmit}>
              <Label htmlFor='username'>Username:</Label>
              <Input
                type='text'
                id='username'
                ref={userRef}
                onChange={(e) => setUsername(e.target.value)}
                required
                onFocus={() => setUserFocus(true)}
                onBlur={() => setUserFocus(false)}
              />

              <Label htmlFor='password'>Password:</Label>
              <Input
                type='password'
                id='password'
                onChange={(e) => setPassword(e.target.value)}
                required
                onFocus={() => setPwdFocus(true)}
                onBlur={() => setPwdFocus(false)}
              />

              <Button disabled={!username || !password}>Sign In</Button>
            </Form>

            <p>
              Create an account:
              <br />
              <StyledLink to='/register'>Register</StyledLink>
            </p>
          </FormSection>
        )}
      </FormContainer>
    </ErrorBoundary>
  );
};

export default LoginForm;
