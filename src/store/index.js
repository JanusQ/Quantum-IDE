import {combineReducers, configureStore } from '@reduxjs/toolkit'
import circuitOpeartionIndex from "./features/circuitOpeartionIndex";
import { userSlice } from './user/slice';
// import {LoginSlcie}
const rootReducer = combineReducers({
	
	userData:userSlice.reducer,
  circuitOpeartionIndex:circuitOpeartionIndex

})




const store = configureStore({
	reducer: rootReducer,
	devTools: true,
	middleware: (getDefaultMiddleware) => {
		// 原因：因为redux存储时是将数据序列化后存储的，并且@reduxjs/toolkit里面会默认检查是否序列化
		return getDefaultMiddleware({
			serializableCheck: false
		})
	}
})
export default store
