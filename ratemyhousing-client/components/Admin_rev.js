import React from 'react'
import { useState } from 'react';
const axios = require('axios')
import cookieCutter from 'cookie-cutter'
import { useRouter } from 'next/router'


const Admin_rev = ({review_string,property_id,review_id}) => {

  
  const [admin_check_hook,setAdmin_check_hoook] = useState(false)

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

  const approve = async (e) => {
    
    const token1 = cookieCutter.get('token')
    const token2 = cookieCutter.get('refreshtoken')

    //http://baseUrl/admin/judge/property/{property_id}?decision={approve/reject}
    const endpoint = `http://34.218.112.35/admin/judge/review/${property_id}/${review_id}?decision=approve`

    // Form the request for sending data to the server.
    const options = {
        // The method is POST because we are sending data.
        method: 'POST',
        // Tell the server we're sending JSON.
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token1}`
        }
        
    }
    
    // Send the form data to our forms API on Vercel and get a response.
    const response = await fetch(endpoint, options)

    // Get the response data from server as JSON.
    // If server returns the name submitted, that means the form works.
    const result = await response.json()
    // console.log(result)
    return new Promise((resolve, reject) => {
        if(result.status === 200){
            console.log(result)
            //router.push("/admin")
            setAdmin_check_hoook(true)
        }
        else {
          console.log(result)
          handleTokenExpiry(result.status,token2);
        }
    })

  }

  const reject = async(e) => {
    
    const token1 = cookieCutter.get('token')
    const token2 = cookieCutter.get('refreshtoken')

    //http://baseUrl/admin/judge/property/{property_id}?decision={approve/reject}
    const endpoint = `${process.env.SERVER_URL}/admin/judge/review/${property_id}/${review_id}?decision=reject`

    // Form the request for sending data to the server.
    const options = {
        // The method is POST because we are sending data.
        method: 'POST',
        // Tell the server we're sending JSON.
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token1}`
        }
        
    }
    
    // Send the form data to our forms API on Vercel and get a response.
    const response = await fetch(endpoint, options)

    // Get the response data from server as JSON.
    // If server returns the name submitted, that means the form works.
    const result = await response.json()
    // console.log(result)
    return new Promise((resolve, reject) => {
        if(result.status === 200){
            console.log(result)
            setAdmin_check_hoook(true)
            //router.push("/admin")
        }
        else {
          console.log(result)
          handleTokenExpiry(result.status,token2);
        }
    })

  }

  return (
    <div>
      { (admin_check_hook === false)  &&
      <div className='transform motion-safe:hover:-translate-y-1 motion-safe:hover:scale-110 transition ease-in-out duration-300 ...'>
        {
        <div className="max-w-sm rounded overflow-hidden shadow-lg border-white-700 bg-[#2c353d] text-gray-300 py-10 px-10 opacity-100 mb-8">
          <div className="py-4 border-white-100">
            <div className="font-bold ">{review_string}</div>
            <div className="px-6 pt-4 pb-2 ">
              <div className="inline-flex px-10 py-4">
                <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l" value={review_id} onClick={approve}>
                  Approve
                </button>
                <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r" value={review_id} onClick={reject}>
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div> }
      </div> }
    </div> )}

export default Admin_rev