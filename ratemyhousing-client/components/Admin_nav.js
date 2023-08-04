import React from 'react'
import HeaderItem from './HeaderItem'
import Image from 'next/image';
import{
  BadgeCheckIcon,
  HomeIcon,
  OfficeBuildingIcon
} from "@heroicons/react/outline";
import Link from 'next/link';

const Admin_nav = () => {

  const home_url = "/"
  return (
    
    <div>
        <nav className="flex items-center justify-between flex-wrap p-6">
          <header className="flex flex-col sm:flex-row m-5 justify-between items-center h-auto">
              <div className="flex justify-between space-x-4 left-0 items-start text-center">
                  <HeaderItem title='HOME' Icon={HomeIcon} url="/"/>
                  <HeaderItem title='PROPERTIES' Icon={OfficeBuildingIcon} url='/admin'/>
                  <HeaderItem title='REVIEWS' Icon={BadgeCheckIcon} url="/admin_reviews"/>
              </div>
          </header>
          <Link href="/">
            <a>
              <Image 
                  className="object-contain"
                  src="/logo.png" 
                  width={100} 
                  height={100}/>
            </a>
          </Link>
          
        </nav>
    </div>
  )
}

export default Admin_nav