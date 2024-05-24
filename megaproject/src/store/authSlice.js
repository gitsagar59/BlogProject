//this slice work is to track authenticate (user authenticate hy ya anai hy)
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status : false,      //user not authenticate
    userData: null          //not have userData
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.status = true; 
            // console.log(action.payload)        
            state.userData = action.payload
        },
        logout: (state) => {
            state.status = false;
            state.userData = null
        }
    }
})

export const {login, logout} = authSlice.actions
export default authSlice.reducer