import React from 'react'
const axios = require('axios');
import { useState } from 'react';
import cookieCutter from 'cookie-cutter'
import { useRouter } from 'next/router'

// takes all the fields input by the user to validate
// confirm password is sent separately because its not a part of the object sent to the API
function validate_information(loginData){
  var valid = true;
  var msg = "Invalid form sumbission: \n\n";

  // Email validation
  var re = new RegExp("[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}");
  if (!re.test(loginData.email)) {
    valid = false;
    msg = msg + "Invalid Email \n"
  }
  //length of pass less than 8
  // if(loginData.password.length < 8){
  //   valid = false;
  //   msg = msg + "Minimum pass length is 8 \n"
  // }
  return{
    isvalid: valid,
    msg: msg
  }
}

const Login = () => {
  const router = useRouter()

  const [token, setToken] = useState("")
  const [refresh, setRefreshToken] = useState("")

  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")

  async function login_account(e) {
    e.preventDefault()

    const loginData = {
      email: email,
      password: password
    }

    // calls the validation function
    // recieves isValid(bool) and msg(string)
    var validation = validate_information(loginData)

    if(!validation.isvalid){
      alert(validation.msg)
      return
    }

    axios.post(`${process.env.SERVER_URL}/auth/login`, loginData)
    .then(function (response) {
      // console.log(response.data.data)
      setToken(response.data.data.token)
      setRefreshToken(response.data.data.refreshToken)

      router.push({
        pathname: "/",
      })
      
    })
    .catch(function (error) {
      alert("User does not exist")
      // console.log(error.response);
    }); 
  }

  if(token){
    cookieCutter.set('token', token)
    cookieCutter.set('refreshtoken', refresh)
  }
  
  return (
      <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
        <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
          <form onSubmit={login_account}>
            <h2 className="font-medium leading-tight text-4xl mt-0 mb-8 text-black text-center">Sign In</h2>
              {/* <!-- Email input --> */}
              <div className="mb-6">
                <input
                  type="email"
                  className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                  id="LoginEmail"
                  placeholder="Email address" 
                  onChange={
                    e => { setEmail(e.currentTarget.value);  }
                  }
                  required="required"
                />
              </div>
              {/* <!-- Password input --> */}
              <div className="mb-6">
                <input
                  type="password"
                  className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                  id="LoginPassword"
                  placeholder="Password"
                  onChange={
                    e => { setPassword(e.currentTarget.value) }
                  }
                  required="required"
                />
              </div>
            <div className="flex justify-between items-center mb-6">
              <div className="form-group form-check">
                {/* TODO: implement remember me functionality */}
                <input
                  type="checkbox"
                  className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                  id="LoginRememberMe"
                />
                <label className="form-check-label inline-block text-black" htmlFor="exampleCheck2">
                  Remember me
                </label>
              </div>
            <a href="/resetPassword" className="text-black id=LoginForgetPassword">Forgot password?</a>
          </div>
          <div className="text-center justify-center items-center lg:text-center">
              <button
                type="submit"
                className="inline-block px-7 py-3 bg-red-500  hover:bg-red-700 hover:shadow-lg 
                focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 
                active:shadow-lg transition duration-150 ease-in-out">
                Login
              </button>
              <p className="text-sm font-semibold mt-2 pt-1 mb-0 text-black">
                Don't have an account? &nbsp;
                <a
                  href="/register"
                  className="text-red-600 hover:text-red-700 focus:text-red-700 transition duration-200 ease-in-out">   
                   Register
                </a>
              </p>
            </div>
        </form>
        </div>
      </div>
    
            
  )
}

export default Login