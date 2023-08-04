import React from 'react'
import Header from '../components/Header'
import Search_results from '../components/Search_results'
import { useRouter } from 'next/router'
import { useState,useEffect } from 'react'
import axios from 'axios'


const added_properties_list = require("../db.js")

const search = () => {
    const [key,setKey] = useState("")
    const router = useRouter()
    const keyword = router.query.keyword
    
    const func = async() => {

    let params = new URLSearchParams({q:keyword})
    await axios.get(`${process.env.SERVER_URL}/search?`+params)
      .then((response) => {
      setKey(response.data.data);
      //console.log(response.data.data);
    });
  }

  useEffect(() => {
    // You need to restrict it at some point
    // This is just dummy code and should be replaced by actual
    if(!key)
      func(); 
  });
  
  return (
    <div>
      <div className='bgimg3'>
        <div>
          {/* Header */}
        <Header />
        </div>
        {key ? <Search_results property={added_properties_list.properties  } arr = {key}/>:  <div></div> }
      </div>
    </div>
    
  )
}

export default search