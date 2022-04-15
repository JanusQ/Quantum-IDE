import axios from 'axios'
import { takeEvery,put } from 'redux-saga/effects'
import { SIGNIN, signinFail, signinSuccess, SIGNUP, signupFail, signupSuccess } from '../actions/auth.actions'
import {setCookie } from '../../helpers/auth'
const Api = "http://localhost/api"
function* hanleSignUp(action){
    try{
        yield axios.post(`${Api}/signup`,action.payload)
        yield put(signupSuccess())
        
    }catch(error){
        yield put(signupFail(error.response.data.error))
    }
}
function* hanleSignIn(action){
    const { isRember,...rest } = action.payload
    try{
        // let response = yield axios.post(`${Api}/signin`,rest)
        // localStorage.setItem('jwt',JSON.stringify(response.data))
        if(isRember){
            setCookie('email',rest.email,7)
            setCookie('password',rest.password,7)
        }
        // yield put(signinSuccess())
    }catch(error){
        yield put(signinFail(error.response.data.error))
    }
}
export default function* authSaga(){
    yield takeEvery(SIGNUP,hanleSignUp)
    yield takeEvery(SIGNIN,hanleSignIn)
}

