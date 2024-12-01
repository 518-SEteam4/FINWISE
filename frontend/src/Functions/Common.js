import axios from "../baseurl"

export const CheckForEmpty = (Field) => {
    return Field === ""
}

export const CheckForEmptyArray = (Array) => {
    return Array.length === 0
}

export const ToggleTrueFalse = (state, setstate) => {
    setstate(!state)
}

export const EmailValidate = (email) => {
    const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    return email.match(isValidEmail)
}

export const PasswordValidate = (password) => {
    return password.length >= 6
}

export const AxiosCallGet = async (method, url, param) => {

   await axios.get( url +"/"+ param)

}
export const CheckUser = async (Email)=>{
    return await axios.post("/Sendmail",{m:Email},{withCredentials:true})
}
export const PostSignupDetails = async (data)=>{
    await axios.post("/userinfo",data,{withCredentials:true})
}
export const ReceiveCookie = async (id)=>{
    await axios.post("/SendCookie",{id:id},{withCredentials:true})
}

export const Savedids= async(id)=>{
   return await axios.get("/savedids/"+id,{withCredentials:true})
}
export const CheckElePresent = async (ele,arr)=>{
        console.log(arr.includes(ele))
        return arr.includes(ele)
}
export const EmailCheckPassword=async (email,navigate,error,SETERROR,setForgetPasswordData,ForgetPasswordData,view,setview,setFrom)=>{
    if(email!=='' && EmailValidate(email)){
      await CheckUser(email).then((res)=>{
            console.log(res.data)
            if(res.data.status){
                    setFrom("forgotpassword")
                    setview("otp")
                    
            }else{
                error("Didn't find careersstudio account with this mail")
            }
      }).catch((err)=>{
            console.log(err)
            SETERROR("No network try again")
      })
    }else{
        error("Email is invalid")
    }
}

export const CountJobs = async (uid)=>{
    return await axios.get("/count/"+uid,{withCredentials:true})

}

export const SignUpCall = async (data)=>{
    return await axios.post("/userinfo",data,{withCredentials:true})
}
export const SignInCall = async (data)=>{
    return await axios.post("/continue",data,{withCredentials:true})
}