import axios from "axios";


axios.defaults.baseURL = 'https://identitytoolkit.googleapis.com/v1';
const API_KEY = 'AIzaSyBvpY26DB5oI9rnFtp6asSlAA_C0qgRNNI'
const REGISTER_URL = `/accounts:signUp?key=${API_KEY}`
const LOGIN_API = `/accounts:signInWithPassword?key=${API_KEY}`

export const RegisterApi = (inputs:any) => {
    let data = {email: inputs.email, password: inputs.password, confirmPassword: inputs.confirmPassword}
    return axios.post(REGISTER_URL,data);
}

export const LoginApi = (inputs:any) => {
    let data = {email: inputs.email, password: inputs.password}
    return axios.post(LOGIN_API,data);
}