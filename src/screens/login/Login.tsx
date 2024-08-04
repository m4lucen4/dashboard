import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LoginForm from './components/LoginForm'
import { RootState } from '../../redux/store'
import Alert from '../../components/Alert/Alert'

const Login: React.FC = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.authenticated
  )
  const loginUserRequest = useSelector(
    (state: RootState) => state.auth.loginUserRequest
  )
  const location = useLocation()
  const { i18n } = useTranslation()

  useEffect(() => {
    const browserLanguage = navigator.language
    i18n.changeLanguage(browserLanguage)
  }, [])

  if (isAuthenticated) {
    return <Navigate to="/home" state={{ from: location }} />
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div>
        {loginUserRequest.messages.length > 0 && (
          <Alert message={loginUserRequest.messages} />
        )}
        <LoginForm />
      </div>
    </div>
  )
}

export default Login
