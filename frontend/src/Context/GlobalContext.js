
import React, { createContext, useState } from 'react'


export const GlobalContext = createContext()


export const GlobalContextProvider = (props) => {
 

    const [Loader, setLoader] = useState(false)
    const [Spin,setSpin]=useState(false)
    const [ERROR,SETERROR]=useState("")
    const [SUCCESS,SETSUCCESS]=useState("")

    

   
    return (
        <GlobalContext.Provider value={{Loader,setLoader,Spin,setSpin,ERROR,SETERROR,SUCCESS,SETSUCCESS}}>
            {props.children}
        </GlobalContext.Provider>
    )
}