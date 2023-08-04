import React from 'react'
const axios = require('axios')
import { useRouter } from 'next/router'


const ForgotPassword = () => {

    const router = useRouter()

    const forgotPassAPI = async (userEmail) => {


        await axios.post('http://34.218.112.35/user/forgotPassword', {
            email : userEmail
        })
        .then(function (response) {
            console.log(response);
            alert("Mail sent, Please check the mail")
            router.push("/")
            
    
        })
        .catch(function (error) {
            alert("User not found")
            console.log(error);
        
        });
    
    }
    
    const handleForgotPassword = async (e) =>  {
    
        e.preventDefault();
        console.log('handleForgot pass');
        const userEmail = e.target.ForgetPasswordEmail.value;
        forgotPassAPI(userEmail);
    
    } 

    return (
    <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
        <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
            <div className="px-8 mb-4 text-center">
                <h3 className="pt-4 mb-2 text-2xl">Forgot Your Password?</h3>
                <p className="mb-4 text-sm text-gray-700">
                    We get it, stuff happens. Just enter your email address below and we'll send you a
                    link to reset your password!
                </p>
            </div>
            <form onSubmit={handleForgotPassword} className="px-8 pt-6 pb-8 mb-4 bg-white rounded">
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="email">
                        Email
                    </label>
                    <input
                        className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded 
                        shadow appearance-none focus:outline-none focus:shadow-outline"
                        id="ForgetPasswordEmail"
                        name='ForgetPasswordEmail'
                        type="email"
                        placeholder="Enter Email Address..."
                        required="required"
                    />
                </div>
                <div className="mb-6 text-center">
                    <button
                        className="w-full px-4 py-2 font-bold text-white bg-red-500 rounded-full 
                        hover:bg-red-700 focus:outline-none focus:shadow-outline"
                        type="submit"
                    >
                        Reset Password
                    </button>
                </div>
                <hr className="mb-6 border-t" />
                <div className="text-center">
                    <a
                        className="inline-block text-sm text-blue-500 align-baseline hover:text-blue-800"
                        href="/register"
                    >
                        Create an Account!
                    </a>
                </div>
                <div className="text-center">
                    <a
                        className="inline-block text-sm text-blue-500 align-baseline hover:text-blue-800"
                        href="/login"
                    >
                        Already have an account? Login!
                    </a>
                </div>
            </form>
        </div>
        </div>   
        )
}
export default ForgotPassword

        

                

                
