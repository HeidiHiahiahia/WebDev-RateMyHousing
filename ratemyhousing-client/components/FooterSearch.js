import React from 'react'
import cookieCutter from 'cookie-cutter'
import { Router, useRouter } from 'next/router'

const FooterSearch = () => {
    const tok = cookieCutter.get('token')
    const router = useRouter()
    const cookie = async () => {
        if(tok){
            router.push("/add_property")
        }
        else{
            alert("You have to be logged in to add a new property")
            router.push("/login")
        }
    }
    
  return (
    <div className="flex flex-col w-2/5 p-6 shadow-lg rounded-lg bg-gray-100 text-gray-700 justify-center items-center ">
        <h3 className="font-semibold text-2xl mb-5 self-center text-center">Did you not find the property you were looking for?</h3>
        <button
            onClick={cookie}
            type="button"
            className="inline-block px-6 py-2 border-2 border-black text-black font-medium text-sm
            leading-normal uppercase rounded hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 
            transition duration-150 ease-in-out items-center"
            data-mdb-ripple="true"
            data-mdb-ripple-color="light">
                Add a new property
        </button>
    </div>
)}

export default FooterSearch