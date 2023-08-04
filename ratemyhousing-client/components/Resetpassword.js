import React from 'react'
import { useRouter } from 'next/router'

const Resetpassword = () => {


    const router = useRouter()
    const keyword = router.query.o
    
    const resetPass = async(e) => {

      e.preventDefault()

      console.log(keyword)
      
      
      const userPassword = e.target.LoginConfPassword.value;

      console.log(userPassword)

      let loginPass = e.target.LoginConfPassword.value
      let confPass = e.target.LoginPassword.value

      if(loginPass === confPass){

          // API endpoint where we send form data.
          const endpoint = `${process.env.SERVER_URL}/user/resetPassword`

          const payload = {
            newPass : userPassword
        }
        let payLoadStr = JSON.stringify(payload);

          // Form the request for sending data to the server.
          const options = {
              // The method is POST because we are sending data.
              method: 'POST',
              // Tell the server we're sending JSON.
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${keyword}`
              },
              // Body of the request is the JSON data we created above.
              body: payLoadStr,
          }
          
          // Send the form data to our forms API on Vercel and get a response.
          const response = await fetch(endpoint, options)

          // Get the response data from server as JSON.
          // If server returns the name submitted, that means the form works.
          const result = await response.json()
          // console.log(result)
          return new Promise((resolve, reject) => {
              if(result.status === 200){
                  console.log(result.status)
                  alert("Sucessfully Submitted")
                  router.push("login")
              }
              else {
                console.log(result.status) 
                if(result.status === 403){
                  alert("Token as expired")
                }
                alert("Something's gone wrong")
              }
          })

            }

      else{
        alert("Login Password and Confirm Password not same")
      }

  }


  return (
    <div>
          <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
            <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
            <form onSubmit={resetPass}>
            <h2 className="font-medium leading-tight text-4xl mt-0 mb-8 text-black text-center">Reset Password</h2>
            <h3 className="font-medium leading-tight text-xl mt-0 mb-8 text-black text-center">Reset the password for your email</h3>
              {/* <!-- Email input --> */}
              <div className="mb-6">
                <input
                  type="password"
                  className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                  id="LoginPassword"
                  placeholder="Password" 
                  required="required"
                  maxLength={30}
                  minLength={8}
                />
              </div>

              {/* <!-- Password input --> */}
              <div className="mb-6">
                <input
                  type="password"
                  className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                  id="LoginConfPassword"
                  placeholder="Confirm Password"
                  required="required"
                  maxLength={30}
                  minLength={8}
                />
              </div>
              <div className="text-center justify-center items-center align-middle lg:text-left">
                <button
                  type="submit"
                  className="inline-block px-7 py-3  place-content-center bg-green-500  hover:bg-green-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg transition duration-150 ease-in-out"
                >
                  Change Password
                </button>
                </div>
            </form>
            </div>
          </div>
        </div>
      
  )
}

export default Resetpassword