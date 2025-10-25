import React, { useState } from 'react';
import { LoginMutation } from '../../types';
import { Alert, Box, Button, Container, Link, TextField, Typography } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectLoginError } from './usersSlice';
import { googleLogin, login } from './usersThunks.ts';
import { GoogleLogin } from '@react-oauth/google';
import Grid from '@mui/material/Grid2';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const error = useAppSelector(selectLoginError);
  const [state, setState] = useState<LoginMutation>({
    email: '',
    password: '',
  });

  const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setState((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  const submitFormHandler = async (event: React.FormEvent) => {
    event.preventDefault();
    await dispatch(login(state)).unwrap();
    navigate('/');
  };

  const googleLoginHandler = async (credential: string) => {
    await dispatch(googleLogin(credential)).unwrap();
    navigate('/');
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        {error && (
          <Alert severity="error" sx={{ nt: 3, width: '100%' }}>
            {error.error}
          </Alert>
        )}
        <Box sx={{ pt: 2 }}>
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              if (credentialResponse.credential) {
                void googleLoginHandler(credentialResponse.credential);
              }
            }}
            onError={() => {
              console.log('Login failed');
            }}
          />
        </Box>
        <Box component="form" onSubmit={submitFormHandler} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid size={12}>
              <TextField
                label="E-mail"
                name="email"
                autoComplete="current-email"
                value={state.email}
                onChange={inputChangeHandler}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                name="password"
                label="Password"
                type="password"
                value={state.password}
                onChange={inputChangeHandler}
                autoComplete="current-password"
              />
            </Grid>
          </Grid>
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Sign in
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid>
              <Link component={RouterLink} to="/register" variant="body2">
                Or sign up
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
