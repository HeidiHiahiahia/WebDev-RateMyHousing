import React from 'react'
import Admin from '../components/Admin'
import { useState,useEffect } from 'react'
import cookieCutter from 'cookie-cutter'
import { useRouter } from 'next/router'


const added_properties_list = require("../db.js")

const admin = () => {

  const router = useRouter()
  const [key,setKey] = useState("")

  useEffect(() => {
    // You need to restrict it at some point
    // This is just dummy code and should be replaced by actual
    if(!key)
      func(); 
  });

  function handleTokenExpiry(status,refreshToken){
    if(status === 403){
        //console.log(`Refresh token ${refreshToken}`)
        refreshTokenRequest(refreshToken).then((res)=>{
            //console.log(`new accessToken ${res.data.token}`);
            cookieCutter.set('token', res.data.token);
            //console.log(`new accessToken ${res.data.token}`);
        },(errStatus)=>{
            //console.log(errStatus);
            alert('Session expired please login again', errStatus);
            router.push("/login");
        })
    }else{
        alert('Property submission failed: ', status);
    }
}

async function refreshTokenRequest(refreshToken){
  // API endpoint where we send form data.
  const endpoint = `${process.env.SERVER_URL}/auth/token`
  const payload = {
      token: refreshToken
  }
  let payLoadStr = JSON.stringify(payload);
  console.log(payLoadStr);
  // Form the request for sending data to the server.
  const options = {
      // The method is POST because we are sending data.
      method: 'POST',
      // Tell the server we're sending JSON.
      headers: {
          'Content-Type': 'application/json'
      },
      // Body of the request is the JSON data we created above.
      body: payLoadStr
  }
  
  // Send the form data to our forms API on Vercel and get a response.
  const response = await fetch(endpoint, options)

  // Get the response data from server as JSON.
  // If server returns the name submitted, that means the form works.
  const result = await response.json()
  // console.log(result)
  return new Promise((resolve, reject) => {
      if(result.status === 200){
          resolve(result)
      }
      else {
          reject(result.status) 
      }
  })
}
   // Token 1 is the access token
   
  const func = async() => {

    const token1 = cookieCutter.get('token')
    const token2 = cookieCutter.get('refreshtoken')

       // API endpoint where we send form data.
       const endpoint = `${process.env.SERVER_URL}/admin/properties`

       // Form the request for sending data to the server.
       const options = {
           // The method is POST because we are sending data.
           method: 'GET',
           // Tell the server we're sending JSON.
           headers: {
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${token1}`
           }
           // Body of the request is the JSON data we created above.
          
       }
       
       // Send the form data to our forms API on Vercel and get a response.
       const response = await fetch(endpoint, options)
   
       // Get the response data from server as JSON.
       // If server returns the name submitted, that means the form works.
       const result = await response.json()
       // console.log(result)
       return new Promise((resolve, reject) => {
           if(result.status === 200){
               console.log(result.data)
               setKey((result.data))
           }
           else {
                handleTokenExpiry(result.status,token2);
           }
       })
  }

  return (
    <div className='bgimg3'>
        <Admin key={key._id} properties={added_properties_list.properties} arr={key}/>
    </div>
  )
}

export default admin