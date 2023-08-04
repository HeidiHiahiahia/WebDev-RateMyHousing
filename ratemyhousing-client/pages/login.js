import React from 'react'
import Login from '../components/Login'
import Header from '../components/Header'
import cookieCutter from 'cookie-cutter'


const login = () => {

  return (
    <div>
    <div className="bgimg1" >
         <div>
            <Header />
        </div>
    
        <Login />
    </div>
    </div>
  )
}

export default login