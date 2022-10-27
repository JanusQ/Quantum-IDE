import { applyMiddleware, createStore } from 'redux'
import createRootReducer from './reducers/index'
import { createHashHistory } from 'history'
import { routerMiddleware } from 'connected-react-router'
import createSagaMiddleware from 'redux-saga'
import rootSage from './sagas'
export const history = createHashHistory()
const sageMiddleware = createSagaMiddleware()
const store = createStore(createRootReducer(history), applyMiddleware(routerMiddleware(history), sageMiddleware))
sageMiddleware.run(rootSage)
export default store

 