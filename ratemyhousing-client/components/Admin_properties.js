import React from 'react'
import Image from 'next/image'
import { useState,useEffect } from 'react'
import AWS from "aws-sdk"
import cookieCutter from 'cookie-cutter'
import { useRouter } from 'next/router'



function encode(data)
{
    var str = data.reduce(function(a,b){ return a+String.fromCharCode(b) },'');
    return btoa(str).replace(/.{76}(?=.)/g,'$&\n');
}

const Admin_properties = ({img_url,address_city,adress_street,adress_state,house_type,property_id}) => {

  const router = useRouter()


  useEffect(()=>{
    admin_check_hook
  })

  const [admin_check_hook,setAdmin_check_hoook] = useState(false)

  const url1 = "/static/images/no_image.jpeg"
  const [pic_url, setPic_url] = useState(url1)

  if(img_url) {
    if(img_url.length === 1 ){
      const s3 = new AWS.S3({
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey:process.env.SECRET_KEY,
        region:process.env.REGION,
      })
      // params to pass to s3
      const params = { 
        Bucket:process.env.BUCKET_NAME, 
        Key:img_url[0]
      }
      s3.getObject(params, function(err, data) {
          // Handle any error and exit
          if (err)
              return err;
        
          // No error happened
          // Convert Body from a Buffer to a String
          let retrievedImage  = "data:image/png;base64," + encode(data.Body);
          
          setPic_url(retrievedImage)
        });
      }
  }


  function go_fetch(e){
    router.push({
      pathname: "/property",
      query: { keyword: e.target.id}
    })
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

function handleTokenExpiry(status,refreshToken){
  if(status === 403){
      //console.log(`Refresh token ${refreshToken}`)
      refreshTokenRequest(refreshToken).then((res)=>{
          //console.log(`new accessToken ${res.data.token}`);
          cookieCutter.set('token', res.data.token);
          //console.log(`new accessToken ${res.data.token}`);
      },(errStatus)=>{
          //console.log(errStatus);
          alert('Session expired please login again ', errStatus);
          router.push("/login");
      })
  }else{
      alert('Property submission failed: ', status);
  }
}


  const approve = async(e) => {
    const token1 = cookieCutter.get('token')
    const token2 = cookieCutter.get('refreshtoken')
    
    //http://baseUrl/admin/judge/property/{property_id}?decision={approve/reject}
    const endpoint = `${process.env.SERVER_URL}/admin/judge/property/${property_id}?decision=approve`

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
          setAdmin_check_hoook(true)
            console.log(result)
            //router.push("/admin")
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
    const endpoint = `${process.env.SERVER_URL}/admin/judge/property/${property_id}?decision=reject`

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
          handleTokenExpiry(result.status,token2);
        }
    })
  }

 

  return (
    <div>
      { (admin_check_hook === false)  &&
      <div className='flex flex-col px-8 py-8'>
          <div className="max-w-sm rounded overflow-hidden shadow-lg px-1 py-1 bg-[#2c353d] text-gray-300 transform motion-safe:hover:-translate-y-1 motion-safe:hover:scale-110 transition ease-in-out duration-300 ...">
            <Image onClick={go_fetch} id={property_id} src={`${pic_url}`} className="w-full justify-center object-cover max-w-full h-auto rounded-lg " width={350} height={250} layout="responsive"/>
            <div className="inline-flex ml-10 mr-10 py-2">
            {/* <div className="flex items-center justify-center">
                <div className="inline-flex shadow-md hover:shadow-lg focus:shadow-lg" role="group">
                  <button type="button" onClick={prevUrl} className="rounded-l inline-block px-6 py-2.5 bg-emerald-900 text-white font-medium text-xs leading-tight uppercase hover:bg-teal-800 focus:bg-emerald-800 focus:outline-none focus:ring-0 active:bg-teal-800 transition duration-150 ease-in-out">Previous</button>
                  <button type="button" onClick={nextUrl} className=" inline-block px-6 py-2.5 bg-emerald-900 text-white font-medium text-xs leading-tight uppercase hover:bg-teal-800 focus:bg-emerald-800 focus:outline-none focus:ring-0 active:bg-teal-800 transition duration-150 ease-in-out">Next</button>
                </div>
              </div> */}
            </div>
            <div className="px-6 mt-2">
              <button onClick={go_fetch}  id={property_id} className="font-bold text-m mb-2"> {adress_street},{address_city},{adress_state}</button>
            </div>
            <div className="px-6 pt-1 pb-2 text-center">
              <p>{house_type}</p>
            </div>
            <div className="inline-flex reponsive ml-10 mr-10 py-2">
              <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l" onClick={approve}>
                Approve
              </button>
              <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r" onClick={reject}>
                Reject
              </button>
            </div>
          </div>
      </div> }
    </div>
  )
}

export default Admin_properties