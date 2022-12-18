import { Cookies } from 'react-cookie'

const cookies = new Cookies()

export const STORAGEKEY = {
  ACCESS_TOKEN: 'Access_token',
  USER_INFO: 'User_info',
  IS_AUTHENTICATED: 'isAuthenticated'
}

export const setCookie = (key, value) => {
  cookies.set(key, value)
}

export const getCookie = (key) => cookies.get(key)
export const removeCookie = async(key) => await cookies.remove(key)
