const axios = require('axios');
import { useState } from 'react';
import { useRouter } from 'next/router'
import Link from 'next/link';

import Image from "next/image"

function SearchForm() {
  const router = useRouter()
  const [searchResult,setSearchResult] = useState(" ")

  const click = async (event) => {
    
  event.preventDefault()
      router.push({
      pathname: "/search",
      query: { keyword: searchResult}
    })

  }
  

  return (
    <div className="flex flex-col items-center text-gray-900" >
      <form className="w-full max-w-lg" >
            <Image 
              src="/img1.jpeg"
              layout="fill"
              objectFit="cover"
            />
            <div className="flex flex-col items-center mb-8">
              <Image 
                className="object-contain justify-center"
                src="/biglogo.png"
                height={200}
                width={400}
              />
            </div>
            <div className="flex flex-wrap mb-6" style={{  position: 'relative' }}>
              {/* <label className="block uppercase tracking-wide text-xs font-bold mb-2 text-white justify-center" htmlFor="search_text">
                Enter an Address to get started
              </label> */}
            <input className="appearance-none block w-full bg-gray-200 border border-gray-200 
                rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                id="search_text" 
                type="text" 
                placeholder="Enter an Address to get started" 
                required="required"
                onChange={
                  e => { setSearchResult(e.currentTarget.value); }
                }
              />
        </div>
        <div className="flex flex-col items-center" style={{  position: 'relative'}}>
          <Link href="/search">
          <button className="bg-gray-200 hover:bg-white text-gray-800 font-semibold py-3 px-4 
          border border-gray-400 rounded shadow w-3/12" onClick={click}>Search</button>
          </Link>
        </div>
      </form>
    </div>
  )
}

export default SearchForm