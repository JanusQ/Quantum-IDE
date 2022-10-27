import React from 'react'
import ReactDOM from 'react-dom'
import Routes from './Routes'
import 'antd/dist/antd.min.css'
import './index.css'
import store from './store/index'
import { Provider } from 'react-redux'
// import App from './App'
import reportWebVitals from './reportWebVitals'
import { ConnectedRouter } from 'connected-react-router'
import { history } from './store'
import './i18n/config'
ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Routes />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
