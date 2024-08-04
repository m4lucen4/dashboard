import React, { useEffect } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Login from './screens/login/Login'
import Home from './screens/home/Home'
import Profile from './screens/profile/Profile'
import Users from './screens/users/Users'
import Inventory from './screens/inventory/Inventory'
import ProtectedRoute from './helpers/ProtectedRoutes'
import Layout from './components/Layout'
import Shop from './screens/shop/Shop'
import Category from './screens/categories/Category'
import { useSelector } from 'react-redux'
import { RootState } from './redux/store'

const App: React.FC = () => {
  const { i18n } = useTranslation()
  const currentUser = useSelector((state: RootState) => state.auth.currentUser)

  useEffect(() => {
    if (currentUser) {
      i18n.changeLanguage(currentUser.language)
    }
  }, [currentUser])

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Layout>
                <Home />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Layout>
                <Users />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventory"
          element={
            <ProtectedRoute>
              <Layout>
                <Inventory />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/categories"
          element={
            <ProtectedRoute>
              <Layout>
                <Category />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/shop"
          element={
            <ProtectedRoute>
              <Layout>
                <Shop />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  )
}

export default App
