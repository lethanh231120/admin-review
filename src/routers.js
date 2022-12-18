import { Navigate } from 'react-router-dom'
import { getCookie, STORAGEKEY } from './utils/storage'

export const PrivateRoute = ({ component: Component }) => {
  const isAuthenticated = Boolean(getCookie(STORAGEKEY.ACCESS_TOKEN))
  return isAuthenticated ? <Component /> : <Navigate to='/login' />
}

export const PublicRouter = ({ component: Component }) => {
  const isAuthenticated = Boolean(getCookie(STORAGEKEY.ACCESS_TOKEN))
  return isAuthenticated ? <Navigate to='/' /> : <Component />
}

