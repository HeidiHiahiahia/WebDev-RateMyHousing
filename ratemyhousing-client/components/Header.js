import{
    HomeIcon,
    UserIcon,
    PlusCircleIcon,
    GlobeIcon,
    LogoutIcon,
    LoginIcon
} from "@heroicons/react/outline";
import Image from "next/image"
import cookieCutter from 'cookie-cutter'
import HeaderItem from "./HeaderItem"
import { useState,useEffect } from 'react'
import jwt_decode from "jwt-decode";
import Link from 'next/link';


function Header(){

    const [cook,setCook] = useState("LOGIN")
    const [adminDisplay,setAdminDisplay] = useState(false)

    const getCook = () => {
        const tok = cookieCutter.get('token')
        if(tok){
        var decoded = jwt_decode(tok);
        if(decoded.role === "admin"){
            setAdminDisplay(true)
            console.log("Admin set to true")
        }
        else{
            setAdminDisplay(false)
        }
        setCook("LOGOUT")
    }
        else{
        setCook("LOGIN")
        setAdminDisplay(false)
        console.log("Admin set to false")
    }
    } 

    useEffect(()=>{
        getCook();
    });

    
    return (
        <header className="flex flex-col sm:flex-row justify-between
                            top-0 z-50 items-center h-auto" >
            <div className="flex justify-between space-x-4 left-0 m-4 items-start text-center "  >
                <HeaderItem title='HOME' Icon={HomeIcon} url='/'/>
                {/* Add logic here, if logged in accunt button should take user to 
                the account page else signIn/signUp */}
                {cook === "LOGIN" ? <HeaderItem title='NEW PROPERTY' Icon={PlusCircleIcon} url='/login'/>:
                <HeaderItem title='NEW PROPERTY' Icon={PlusCircleIcon} url='/add_property'/>}
                {/* <HeaderItem title='NEW PROPERTY' Icon={PlusCircleIcon} url='/add_property'/> */}
                {cook === "LOGIN" ?
                 <HeaderItem title={cook} Icon={LoginIcon} url='/login' /> :
                  <HeaderItem title={cook} Icon={LogoutIcon} url='/' /> } 
                {(cook === "LOGOUT" && adminDisplay === true) ? 
                <HeaderItem title='ADMIN' Icon={GlobeIcon} url='/admin'/>:<div></div>}
            </div>
            <div className="topright">
            <Link href="/">
                <a>
                <Image 
                        className="object-contain"
                        src="/logo.png" 
                        width={100} 
                        height={100}/>
                </a>
            </Link>
            </div>
            
        </header>
    )
}

export default Header