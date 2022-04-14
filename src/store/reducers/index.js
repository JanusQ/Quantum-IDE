import { connectRouter } from 'connected-react-router'
import { combineReducers } from 'redux'
import testReducer from './test.reducer'
import authReducer from './auth.reducer'
const createRootReducer = (history) => combineReducers({
    test:testReducer,
    router:connectRouter(history),
    auth: authReducer
})
export default createRootReducer
