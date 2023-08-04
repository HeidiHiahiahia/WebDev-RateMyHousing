import cookieCutter from 'cookie-cutter'
const axios = require('axios');
import { useState } from 'react'
import { useRouter } from 'next/router'

function HeaderItem({Icon, title, url}) {
    
    const [title1,setTitle] = useState(title)
    const router = useRouter()

    const logout = async (e) => {
        e.preventDefault()
        const vari = cookieCutter.get('refreshtoken')
        
        axios.post(`${process.env.SERVER_URL}/auth/logout`, {"token": vari } )
        .then(function (response) {
        console.log(response.data.data)

        cookieCutter.set('token', '', { expires: new Date(0) })
        cookieCutter.set('refreshtoken', '', { expires: new Date(0) })
        setTitle("LOGIN")

        if(title1 === "LOGIN"){
        alert("You have Sucessfully Logged out")
        router.push("/")
        }
        })
        .catch(function (error) {
            console.log(error.response);
        }); 
    }
    return (
        <div className="flex flex-col items-center cursor-pointer group
            w-12 sm:w-20 hover:text-white"> 
            <a href={url}>
                {title === "LOGOUT" ? <Icon onClick={logout} className="h-8 mb-1 group-hover:animate-bounce"/> : <Icon className="h-8 mb-1 group-hover:animate-bounce"/> }
                {/* <Icon className="h-8 mb-1 group-hover:animate-bounce"/> */}
            </a>
            <a className="opacity-70 hover:opacity-100 tracking-widest" href={url}>
                {title === "LOGOUT" ? <button onClick={logout}>{title}</button> :<button>{title}</button> }
            </a>
        </div>
    )
}

export default HeaderItem;
