import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { login } from '@/api/auth'
import { setToken, setUserData, getUserData, noLogin } from '@/utils/storage'
import { message } from 'antd'
const initialState = {
  userData: getUserData() || noLogin(),
  loading: false,
}
export const loginThunk = createAsyncThunk(
  'user/login/',
  async (loginData, thunkAPI) => {
    try {
      const { data } = await login(loginData)

      return data
    } catch (error) {
      thunkAPI.dispatch(userSlice.actions.setError(error))
    }
  }
)
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: {
    [loginThunk.pending.type]: (state) => {
      state.loading = true
    },
    [loginThunk.fulfilled.type]: (state, action) => {
      state.loading = false
      state.userData = action.payload

      if (typeof action.payload !== 'undefined') {
        state.token = action.payload.token
        setToken(action.payload.token)
        setUserData(action.payload)
        message.success('登录成功')
      }
    },
    [loginThunk.rejected.type]: (state, action) => {
      state.loading = false
    },
  },
})
