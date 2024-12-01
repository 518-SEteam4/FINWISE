
import React, { createContext, useState } from 'react'


export const SignUpContext = createContext()


export const SignUpContextProvider = (props) => {
 

    const [SignUpData, setSignUpData] = useState({
            m:"",
            p:"",
            l:"",
            fn:"",
            ln:"",
            dob:"",
    })
    const [SigninData,setSigninData] = useState({
        m:"",
        id:""
    })
    const [ForgetPasswordData,setForgetPasswordData] = useState({
        m:""
    })

    

   
    return (
        <SignUpContext.Provider value={{SignUpData,setSignUpData,SigninData,setSigninData,ForgetPasswordData,setForgetPasswordData}}>
            {props.children}
        </SignUpContext.Provider>
    )
}