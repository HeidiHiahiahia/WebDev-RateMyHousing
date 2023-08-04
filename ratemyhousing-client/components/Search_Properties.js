import React from 'react'
import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/router'
import AWS from "aws-sdk"

function encode(data)
{
    var str = data.reduce(function(a,b){ return a+String.fromCharCode(b) },'');
    return btoa(str).replace(/.{76}(?=.)/g,'$&\n');
}

const Search_Properties = ({p_id,address_city,adress_street,adress_state,house_type,overall_rating,img_url,totalReviewCount}) => {

  const router = useRouter()
  const url1 = "/static/images/no_image.jpeg"
  const [pic_url, setPic_url] = useState(url1)

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

    function go_fetch(e){
      router.push({
        pathname: "/property",
        query: { keyword: e.target.id}
      })
    }

    const filled_color = "M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"

    const unfilled_color = "M528.1 171.5L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6zM388.6 312.3l23.7 138.4L288 385.4l-124.3 65.3 23.7-138.4-100.6-98 139-20.2 62.2-126 62.2 126 139 20.2-100.6 98z"
  
    // console.log(imgSrc)

  return (
    <div>
          <div className='px-8 py-8'>
          <div className="max-w-sm rounded overflow-hidden shadow-lg px-1 py-1 bg-[#2c353d] text-gray-300 transform motion-safe:hover:-translate-y-1 motion-safe:hover:scale-110 transition ease-in-out duration-300 ...">
            <Image onClick={go_fetch} id={p_id} src={`${pic_url}`} className="w-full justify-center object-cover max-w-full h-auto rounded-lg " width={300} height={250} layout="responsive"/>
            <div className='py-3'>
                <ul className="flex justify-center">
                    <li className='pt-1'> 
                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="star" className="w-5 text-yellow-500 mr-1" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                        <path fill="currentColor" d={Math.round(overall_rating) > 0 ? filled_color : unfilled_color}></path>
                        </svg>
                    </li>
                    <li className='pt-1'>
                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="star" className="w-5 text-yellow-500 mr-1" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                        <path fill="currentColor" d={Math.round(overall_rating) > 1 ? filled_color : unfilled_color}></path>
                        </svg>
                    </li>
                    <li className='pt-1'>
                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="star" className="w-5 text-yellow-500 mr-1" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                        <path fill="currentColor" d={Math.round(overall_rating) > 2 ? filled_color : unfilled_color}></path>
                        </svg>
                    </li>
                    <li className='pt-1'> 
                        <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="star" className="w-5 text-yellow-500 mr-1" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                        <path fill="currentColor" d={Math.round(overall_rating) > 3 ? filled_color : unfilled_color}></path>
                        </svg>
                    </li>
                    <li className='pt-1'>
                        <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="star" className="w-5 text-yellow-500" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                        <path fill="currentColor" d={Math.round(overall_rating) > 4 ? filled_color : unfilled_color}></path>
                        </svg>
                    </li>
                    <li className='text-lg pb-2'>
                    &nbsp; &nbsp; ({totalReviewCount}) 
                    </li>
                    
                    </ul>
                    
                </div>
            <div className="px-6">
              <button className="font-bold text-m mb-2" id={p_id} onClick={go_fetch}>Address: {adress_street}, {address_city}, {adress_state}</button>
            </div>
            <div className="flex py-2 justify-center px-6 pt-4 pb-2 object-center ml-1">
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 place-items-center align-middle">{house_type}</span>
            </div>
            
          </div>
      </div>
    </div>
  )
}

export default Search_Properties