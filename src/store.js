import rootReducer from './redux'
import { configureStore } from '@reduxjs/toolkit'
const store = configureStore({ reducer: rootReducer })
export default store
