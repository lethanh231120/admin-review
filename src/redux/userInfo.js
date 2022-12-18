import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { get } from '../api/products'

const config = {
  headers: {
    'Content-Type': 'multipart/form-data',
    'Accept': 'application/json'
  }
}

const initialState = {
  userInfo: {},
  isAuthenticated: false,
  message: ''
}

export const getUserInfo = createAsyncThunk(
  'user/getUserInfo',
  async() => {
    return await get('user')
  }
)

const userInfo = createSlice({
  name: 'userInfo',
  initialState,
  extraReducers: {
    // Login
    [getUserInfo.pending]: (state, action) => {
      state.message = 'loading'
    },
    [getUserInfo.fulfilled]: (state, action) => {
      state.userInfo = action.payload
      state.isAuthenticated = true
      state.message = 'success'
    },
    [getUserInfo.rejected]: (state, action) => {
      state.message =
        'Get user info fail ! Please try again. If still fail, please contact to admin@demo.com'
    }
  },
  reducers: {
    resetUserInfo: (state, { payload }) => {
      return initialState
    }
  }
})
const { reducer, actions } = userInfo
export const { resetUserInfo } = actions

export default reducer
