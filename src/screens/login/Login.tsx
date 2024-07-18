import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import { RootState } from '../../redux/store';
import Alert from '../../components/Alert/Alert';

const Login: React.FC = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.authenticated
  );
  const loginUserRequest = useSelector(
    (state: RootState) => state.auth.loginUserRequest
  );
  const location = useLocation();

  if (isAuthenticated) {
    return <Navigate to="/home" state={{ from: location }} />;
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div>
      {loginUserRequest.messages.length > 0 && (
        <Alert message={loginUserRequest.messages} />
      )}
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
