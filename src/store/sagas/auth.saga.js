import axios from 'axios'
import { takeEvery,put } from 'redux-saga/effects'
import { SIGNIN, signinFail, signinSuccess, SIGNUP, signupFail, signupSuccess } from '../actions/auth.actions'
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
    try{
        let response = yield axios.post(`${Api}/signin`,action.payload)
        localStorage.setItem('jwt',JSON.stringify(response.data))
        yield put(signinSuccess())
    }catch(error){
        yield put(signinFail(error.response.data.error))
    }
}
export default function* authSaga(){
    yield takeEvery(SIGNUP,hanleSignUp)
    yield takeEvery(SIGNIN,hanleSignIn)
}
