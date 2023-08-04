import React from 'react'
import Amenites from './Amenites'
import Property_detail_reviews from './Property_detail_reviews'
import { useState } from 'react'
import { useRouter } from 'next/router'
import AWS from "aws-sdk"
import Image from 'next/image'

function encode(data)
{
    var str = data.reduce(function(a,b){ return a+String.fromCharCode(b) },'');
    return btoa(str).replace(/.{76}(?=.)/g,'$&\n');
}

const calculate_ratings = (arr) => {
    let overall = arr.totalReviewCount
    //console.log(overall)
    if (overall === 0){
        return []
    }
    let awesome = arr.ratingBreakDown.awesome
    let great = arr.ratingBreakDown.great
    let good = arr.ratingBreakDown.good
    let ok = arr.ratingBreakDown.ok
    let aweful = arr.ratingBreakDown.aweful

    let progress = [(awesome/overall)*100, 
                (great/overall)*100,
                (good/overall)*100,
                (ok/overall)*100,
                (aweful/overall)*100 ]
    
    return progress
}

const Property_detail = ({arr,rev}) => {
    ////console.log("for rev",rev.data)

    //console.log("for arr",arr)

    const url1 = "/static/images/no_image.jpeg"
    const [pic_url, setPic_url] = useState(url1)

    if(arr.pictures.length === 1 ){
        const s3 = new AWS.S3({
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey:process.env.SECRET_KEY,
        region:process.env.REGION,
        })
      // params to pass to s3
        const params = { 
        Bucket:process.env.BUCKET_NAME, 
        Key:arr.pictures[0]
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

    let ratings = calculate_ratings(arr)
    //console.log(ratings)
    
    const progress_value = (10/50)*100
    //console.log("progress",progress_value)
    

    const router = useRouter()

    const send_review = () =>{
        router.push({
            pathname: "/add_review",
            query: { keyword: arr._id}
        })
    }

    const filled_color = "M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"

    const unfilled_color = "M528.1 171.5L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6zM388.6 312.3l23.7 138.4L288 385.4l-124.3 65.3 23.7-138.4-100.6-98 139-20.2 62.2-126 62.2 126 139 20.2-100.6 98z"


  ////console.log(added_prop)

    return (
        <div>
            <section className="overflow-contain text-gray-700">
            <div className="container px-5 py-2 mx-auto lg:pt-24 lg:px-32">
                <div className="flex flex-wrap -m-1 md:-m-2">
                    <div className="flex flex-wrap w-1/2">
                    {/* First column */}
                        <div className="w-full h-1/4 p-1 md:p-2">
                            {/* Row 1 Column 1 */}
                            <div>
                                <div className="flex justify-center">
                                    <div className="block p-6 rounded-lg shadow-lg bg-white max-w-l">
                                        <div className="flex justify-center">
                                            <ul className="bg-white rounded-lg w-96 text-black">
                                                <li className="px-2 py-2 border-b border-gray-200 w-full rounded-t-lg font-semibold">Address: &nbsp;&nbsp; {arr.address.street}, {arr.address.city}, {arr.address.postalCode} </li>
                                                <li className="px-2 py-2 border-b border-gray-200 w-full font-semibold">Property Type: &nbsp; {arr.propertyType}</li>
                                                <li className="px-2 py-2 border-b border-gray-200 w-full flex font-semibold">Overall rating: &nbsp; &nbsp;
                                                    <ul className="flex pt-1">
                                                        <li>
                                                            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="star" className="w-5 text-yellow-500 mr-1" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                                            <path fill="currentColor" d={Math.round(arr.overallRating) > 0 ? filled_color : unfilled_color}></path>
                                                            </svg>
                                                        </li>
                                                        <li>
                                                            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="star" className="w-5 text-yellow-500 mr-1" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                                            <path fill="currentColor" d={Math.round(arr.overallRating) > 1 ? filled_color : unfilled_color}></path>
                                                            </svg>
                                                        </li>
                                                        <li>
                                                            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="star" className="w-5 text-yellow-500 mr-1" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                                            <path fill="currentColor" d={Math.round(arr.overallRating) > 2 ? filled_color : unfilled_color}></path>
                                                            </svg>
                                                        </li>
                                                        <li>
                                                            <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="star" className="w-5 text-yellow-500 mr-1" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                                            <path fill="currentColor" d={Math.round(arr.overallRating) > 3 ? filled_color : unfilled_color}></path>
                                                            </svg>
                                                        </li>
                                                        <li>
                                                            <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="star" className="w-5 text-yellow-500" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                                            <path fill="currentColor" d={Math.round(arr.overallRating) > 4 ? filled_color : unfilled_color}></path>
                                                            </svg>
                                                        </li>

                                                        
                                                    </ul>
                                                    &nbsp; &nbsp; ({arr.totalReviewCount})
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full h-2/4 p-1 md:p-2 py-2">
                            {/* Row 2 Column 1 */}
                        <div className='h-3/4'>
                            <div className="flex justify-center">
                                <div className="block p-6 rounded-lg shadow-lg bg-white max-w-l">
                                    <h5 className="text-black text-xl leading-tight font-medium mb-2">Rating Distribution</h5>
                                    <div className="flex justify-center">
                                        <ul className="bg-white rounded-lg w-96 text-black py-2">
                                            <li className=" py-2 border-b border-gray-200 w-full rounded-t-lg"> Awesome 5
                                            {arr.totalReviewCount > 0 ? <progress className="progress  w-56 px-2 " value={ratings[0]} max="100"></progress>: <progress className="progress  w-56 px-2 " value="0" max="100"></progress>}
                                            {arr.ratingBreakDown.awesome}
                                            </li>
                                            <li className=" py-2 border-b border-gray-200 w-full">Great  &nbsp; &nbsp; &nbsp;     4 
                                            {arr.totalReviewCount > 0 ? <progress className="progress  w-56 px-2 " value={ratings[1]} max="100"></progress>: <progress className="progress  w-56 px-2 " value="0" max="100"></progress>}
                                            {arr.ratingBreakDown.great}
                                            </li>
                                            <li className=" py-2 border-b border-gray-200 w-full">Good &nbsp; &nbsp; &nbsp;  3    
                                            {arr.totalReviewCount > 0 ? <progress className="progress  w-56 px-2 " value={ratings[2]} max="100"></progress>: <progress className="progress  w-56 px-2 " value="0" max="100"></progress>}
                                            {arr.ratingBreakDown.good}
                                            </li>
                                            <li className=" py-2 border-b border-gray-200 w-full">Ok &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 2     
                                            {arr.totalReviewCount > 0 ? <progress className="progress  w-56 px-2 " value={ratings[3]} max="100"></progress>: <progress className="progress  w-56 px-2 " value="0" max="100"></progress>}
                                            {arr.ratingBreakDown.ok}
                                            </li>
                                            <li className=" py-2 w-full rounded-b-lg">Awful &nbsp; &nbsp; &nbsp; 1 
                                            {arr.totalReviewCount > 0 ? <progress className="progress  w-56 px-2 " value={ratings[4]} max="100"></progress>: <progress className="progress  w-56 px-2 " value="0" max="100"></progress>}
                                            {arr.ratingBreakDown.aweful}
                                            </li>
                                        </ul>
                                    </div>
                                    </div>
                                </div>
                                <div className="flex justify-center py-2 h-1/4">
                                    <div className="block p-6 rounded-lg max-w-sm">
                                        <button type="button" onClick={send_review} className=" inline-block px-6 py-2.5 bg-emerald-600 text-white font-medium
                                         text-xs leading-tight uppercase rounded shadow-md hover:bg-emerald-800 hover:shadow-lg focus:bg-emerald-800
                                          focus:shadow-lg focus:outline-none focus:ring-0 active:bg-emerald-800 active:shadow-lg transition duration-150 ease-in-out">
                                          Submit a review</button>
                                    </div>
                                </div>
                            </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap w-1/2">
                            <div className="w-full h-2/3 ">
                                {/* Row 1 Column 2 */}
                            <div className=''>
                            <div className="flex justify-center">
                                <div className="rounded-lg shadow-lg  max-w-sm">
                                    <a href="#!" data-mdb-ripple="true" data-mdb-ripple-color="light">
                                        {/* <img className="rounded-t-lg" src={pic_url} alt="" width={300} height={300}/> */}
                                        <Image  src={pic_url} className="rounded-t-lg"  width={350} height={300} />

                                    </a>
                                    {/* <div className="flex items-center justify-center">
                                        <div className="inline-flex shadow-md hover:shadow-lg focus:shadow-lg" role="toolbar">
                                            <button type="button" className="rounded-l inline-block px-6 py-2.5 bg-emerald-600 text-white font-medium text-xs leading-tight uppercase hover:bg-emerald-700 focus:bg-emerald-800 focus:outline-none focus:ring-0 active:bg-emerald-800 transition duration-150 ease-in-out" onClick={nextUrl}>Previous</button>
                                            <button type="button" className=" inline-block px-6 py-2.5 bg-emerald-600 text-white font-medium text-xs leading-tight uppercase hover:bg-emerald-700 focus:bg-emerald-800 focus:outline-none focus:ring-0 active:bg-emerald-800 transition duration-150 ease-in-out" onClick={prevUrl}>Next</button>
                                        </div>
                                        </div> */}
                                </div>
                            </div>
                            </div>
                            </div>
                            <div className="w-full h-1/3  overscroll-contain">
                                {/* Row 2 Column 2 */}
                            <div className='overscroll-contain'>
                            <div className="flex justify-center overscroll-y-auto">
                                    <div className="block p-2 rounded-lg shadow-lg bg-white max-w-l">
                                        <h5 className="text-gray-900 text-xl  leading-tight font-medium mb-2 text-center">Amenities list</h5>
                                        <div className="flex flex-wrap justify-center space-x-2 ">
                                            {arr.amenities.map((object) => <Amenites obj={object.amenity} obj_avail={object.available} 
                                            key={object.id} />)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
                    

            <section className='py-4 px-4 mt-4'> 
             {/* {  (rev.data !== 0 && rev.data.length === 0) ? <div><Noreviews /></div>: <div></div>}  */}
            { rev.data ? rev.data.map((res) => < Property_detail_reviews  accessibility={res.accessibility} bathNum={res.bathNum} 
                                bedNum={res.bedNum} cleanliness={res.cleanliness} costReview={res.costReview} crowdedness={res.crowdedness} 
                                flags={res.flags} landlordRating={res.landlordRating} neighborhood={res.neighborhood} overallRatingReview={res.overallRatingReview} 
                                textReview = {res.textReview} voteUp = {res.voteUp} par_id = {arr._id} review_id = {res._id}
                                /> ) 
                            
                        :  <div></div>
            }
            </section>
        </div>
)
}

export default Property_detail