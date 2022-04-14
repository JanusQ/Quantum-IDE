import authSaga from "./auth.saga";
import { all } from "redux-saga/effects"

export default function* rootSage(){
    yield all([
        authSaga()
    ])
}