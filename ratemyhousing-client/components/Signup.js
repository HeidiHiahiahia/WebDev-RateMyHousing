import React from 'react'
const axios = require('axios');
import { useState } from 'react';
import { useRouter } from 'next/router'

// takes all the fields input by the user to validate
// confirm password is sent separately because its not a part of the object sent to the API
function validate_information(signUpData, confirm_password){
  var valid = true;
  var msg = "Invalid form sumbission: \n\n";

  // Email validation
  var re = new RegExp("[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}");
  if (!re.test(signUpData.email)) {
    valid = false;
    msg = msg + "Invalid Email \n"
  }
  //length of pass less than 8
  if(signUpData.password.length < 8){
    valid = false;
    msg = msg + "Minimum pass length is 8 \n"
  }
  //passwords match
  if(signUpData.password !== confirm_password){
    valid = false;
    msg = msg + "Passwords do not match \n"
  }
  //phonenumber 10 digits
  if(signUpData.phoneNo.length < 10){
    valid = false
    msg = msg + "Invalid phone number \n"
  }
  return{
    isvalid: valid,
    msg: msg
  }
}

const Signup = () => {
  const router = useRouter()
  const [name,setName] = useState("")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [confirm_password, setConfirmPassword] = useState('');
  const [phoneNo,seTphoneNo]  = useState("")
  const [sucess,setSucess] = useState()

  const create_account = async (e) => {
    const signUpData = {
      name: name,
      email: email,
      password: password,
      phoneNo: phoneNo
    }

    // calls the validation function
    // recieves isValid(bool) and msg(string)
    var validation = validate_information(signUpData, confirm_password)

    if(!validation.isvalid){
      alert(validation.msg)
      return
    }
    
    axios.post(`${process.env.SERVER_URL}/auth/signup`, signUpData)
    .then(function (response) {
      // console.log(response.status);
      if(response.status == 201){
        alert("User Created")
        router.push({
          pathname: "/"
      })
        setSucess(false)
      }
    })
    .catch(function (error) {
      //console.log(error.response);
      if(error.response.data.status === 11000){
        alert("User alreay exits")
        router.push({
          pathname: "/login"
      })
      }
    }); 
} 
  return (
    <div>
          <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
            <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full">

                    <h1 className="mb-8 text-3xl text-center">Sign up</h1>
                    <input 
                        type="text"
                        className="block border border-grey-light w-full p-3 rounded mb-4"
                        name="username"
                        onChange={
                          e => { setName(e.currentTarget.value);  }}
                        placeholder="User Name" 
                      />

                    <input 
                        type="text"
                        className="block border border-grey-light w-full p-3 rounded mb-4"
                        name="email"
                        onChange={e => { setEmail(e.currentTarget.value); }}
                        placeholder="Email" />

                    <input 
                        type="tel"
                        className="block border border-grey-light w-full p-3 rounded mb-4"
                        name="phonenumber"
                        onChange={e => { seTphoneNo(e.currentTarget.value); }}
                        placeholder="Phone Number (Numbers only)" 
                        maxLength={10}
                    />

                    <input 
                        type="password"
                        className="block border border-grey-light w-full p-3 rounded mb-4"
                        name="password"
                        onChange={e => { setPassword(e.currentTarget.value); }}
                        placeholder="Password" />

                    <input 
                        type="password"
                        className="block border border-grey-light w-full p-3 rounded mb-4"
                        name="confirm_password"
                        onChange={e => { setConfirmPassword(e.currentTarget.value); }}
                        placeholder="Confirm Password" />

                    {
                      sucess ? 
                      // successful
                      <a href='/login'> 
                        <button
                            type="submit"
                            onClick={create_account}
                            className="w-full text-center py-3 bg-green text-white bg-red-500 
                            rounded-full hover:bg-red-700 focus:outline-none focus:shadow-outline my-1" >
                            Create Account
                        </button> 
                      </a> : 
                      // not successful
                      <a href='#'> 
                        <button
                            type="submit"
                            onClick={create_account}
                            className="w-full text-center py-3 bg-green text-white bg-red-500 
                            rounded-full hover:bg-red-700 focus:outline-none focus:shadow-outline my-1">
                            Create Account
                        </button> 
                      </a> 
                    } 
                    <div className="text-center text-sm text-grey-dark mt-4">
                        By signing up, you agree to the &nbsp;
                        <a className="no-underline border-b border-grey-dark text-grey-dark" href="#">
                            Terms of Service&nbsp;
                        </a> and &nbsp;
                        <a className="no-underline border-b border-grey-dark text-grey-dark" href="#">
                            Privacy Policy
                        </a>
                    </div>
                </div>
      </div>
    </div>
  

      
      
  )
}

export default Signup