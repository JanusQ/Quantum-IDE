

export const SIGNUP = "SINGUP"
export const SIGNUP_SUCCESS = "SIGNUP_SUCCESS"
export const SIGNUP_FAIL = "SIGNUP_FAIL"
export const RESET_SIGNUP = "RESET_SIGNUP"
export const signup = (payload) => ({
    type: SIGNUP,
    payload
})
export const signupSuccess = ()=>({type:SIGNUP_SUCCESS})
export const signupFail = (message)=>({type:SIGNUP_FAIL, message})
export const resetSignup = ()=>({type:RESET_SIGNUP})

export const SIGNIN = "SIGNIN"
export const SIGNIN_SUCCESS = "SIGNIN_SUCCESS"
export const SIGNIN_FAIL = "SIGNIN_FAIL"

export const signin = (payload) => ({
    type:SIGNIN,
    payload
})
export const signinFail = (message)=>({type:SIGNIN_FAIL,message})
export const signinSuccess = () => ({type:SIGNIN_SUCCESS})