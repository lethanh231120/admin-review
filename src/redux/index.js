import { combineReducers } from '@reduxjs/toolkit'

import loginUser from './userInfo'

export default combineReducers({
  loginUser: loginUser,
})
