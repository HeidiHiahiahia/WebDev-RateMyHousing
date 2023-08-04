import React from 'react'
import { useEffect, useState } from 'react/cjs/react.development';
const axios = require('axios');
import cookieCutter from 'cookie-cutter'

const Property_detail_reviews = ({
  accessibility,
  bathNum,
  bedNum,
  cleanliness,
  costReview,
  crowdedness,
  voteUp,
  par_id,
  review_id,
  landlordRating,
  neighborhood,
  overallRatingReview,
  textReview}) => {

    const [upVoteCheck,setUpVoteCheck] = useState(false)
    const [flagCheck,setFlagCheck] = useState(false)
    const [upVoteVal,setUpVoteVal] = useState(voteUp)

    const filled_color =  "M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"
    const unfilled_color = "M458.4 64.3C400.6 15.7 311.3 23 256 79.3 200.7 23 111.4 15.6 53.6 64.3-21.6 127.6-10.6 230.8 43 285.5l175.4 178.7c10 10.2 23.4 15.9 37.6 15.9 14.3 0 27.6-5.6 37.6-15.8L469 285.6c53.5-54.7 64.7-157.9-10.6-221.3zm-23.6 187.5L259.4 430.5c-2.4 2.4-4.4 2.4-6.8 0L77.2 251.8c-36.5-37.2-43.9-107.6 7.3-150.7 38.9-32.7 98.9-27.8 136.5 10.5l35 35.7 35-35.7c37.8-38.5 97.8-43.2 136.5-10.6 51.1 43.1 43.5 113.9 7.3 150.8z"


    useEffect(()=>{
      upVoteVal
      upVoteCheck
      flagCheck
    })

    const handle_upvote = async (e) => {

    e.preventDefault()

    let isClicked = cookieCutter.get(review_id)
    //console.log(`Clicked ${isClicked}`)

        if(!isClicked) {
          axios.patch(`${process.env.SERVER_URL}/review/vote/${par_id}/${review_id}`, {vote: 1}
          )
          .then(function (response) {
            console.log(response);
            cookieCutter.set(review_id, true)
            setUpVoteVal(voteUp + 1)
            setUpVoteCheck(true)
            
          })
          .catch(function (error) {
            console.log(error.response);
            
          }); 
        }
        else{
          alert("You have alredy upvoted the review")
        }
    }

    const handle_flag = async (e) => {
      e.preventDefault()
      
      let isFlagged = cookieCutter.get(review_id+"flag")
      if(!isFlagged) {
        axios.put(`${process.env.SERVER_URL}/flag/${par_id}/${review_id}`
        )
        .then(function (response) {
          console.log(response);
          cookieCutter.set(review_id+"flag", true)
          setFlagCheck(true)
          console.log(`${review_id} and ${par_id}`)
          
        })
        .catch(function (error) {
          console.log(error.response);
          
        }); 
      }
      else{
        alert("Review is already flagged")
      }

    }

  return (
  <div className='pt-4 px-4 mt mt-7 overflow-auto overscroll-auto '>
    <nav className="
      relative
      w-full
      flex flex-wrap
      items-center
      justify-between
      py-4
      bg-gray-100
      text-gray-500
      hover:text-gray-700
      focus:text-gray-700
      shadow-lg
      navbar navbar-expand-lg navbar-light
      ">
    <div className="container-fluid w-full flex  items-center justify-between px-6">
      <div className="flex-grow items-center">
        <div className='flex'>
          <div className='flex-col-1'>
            Beds: {bedNum}
          </div>
          <div className='flex-col-2 px-3'>
            Baths: {bathNum}
          </div>
          <div className='flex-col-2 px-3'>
            Cost per month: {costReview}
          </div>
        </div>
      </div>
      <div className="flex items-center relative">

        {upVoteCheck === false ? <button onClick={handle_upvote} className="text-gray-500 hover:text-gray-700 focus:text-gray-700 mr-4" href="#" alt="UpVotes">
        <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="arrow-alt-circle-up" className="w-7 h-7" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" alt="UpVotes">
            <path fill="currentColor" d="M256 504c137 0 248-111 248-248S393 8 256 8 8 119 8 256s111 248 
            248 248zm0-448c110.5 0 200 89.5 200 200s-89.5 200-200 200S56 366.5 56 256 145.5 56 256 56zm20 
            328h-40c-6.6 0-12-5.4-12-12V256h-67c-10.7 0-16-12.9-8.5-20.5l99-99c4.7-4.7 12.3-4.7 17 0l99 
            99c7.6 7.6 2.2 20.5-8.5 20.5h-67v116c0 6.6-5.4 12-12 12z"></path>
          </svg> 
          
          <span  className="text-white bg-red-700 absolute rounded-full text-xs -mt-8 ml-0 py-0 px-1.5">{upVoteVal}</span>
        </button> : 
        
        <button className="text-green-500 hover:text-green-700 focus:text-green-700 mr-4" href="#" alt="UpVotes">
        <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="arrow-alt-circle-up" className="w-7 h-7" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" alt="UpVotes">
            <path fill="currentColor" d="M256 504c137 0 248-111 248-248S393 8 256 8 8 119 8 256s111 248 
            248 248zm0-448c110.5 0 200 89.5 200 200s-89.5 200-200 200S56 366.5 56 256 145.5 56 256 56zm20 
            328h-40c-6.6 0-12-5.4-12-12V256h-67c-10.7 0-16-12.9-8.5-20.5l99-99c4.7-4.7 12.3-4.7 17 0l99 
            99c7.6 7.6 2.2 20.5-8.5 20.5h-67v116c0 6.6-5.4 12-12 12z"></path>
          </svg> 
          
          <span  className="text-white bg-red-700 absolute rounded-full text-xs -mt-8 ml-0 py-0 px-1.5">{upVoteVal}</span>
        </button>  }
        
      <div className="dropdown relative">
            {flagCheck === false ? 
                <button onClick={handle_flag} className="
                    text-gray-500
                    hover:text-gray-700
                    focus:text-gray-700
                    mr-4
                    dropdown-toggle
                    hidden-arrow
                    flex items-center
                  " id="dropdownMenuButton1" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <svg className="h-8 w-8 text-gray-700"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />  <line x1="4" y1="22" x2="4" y2="15" /></svg>
              </button>: 
              <button onClick={handle_flag} className="
                text-gray-500
                hover:text-gray-700
                focus:text-gray-700
                mr-4
                dropdown-toggle
                hidden-arrow
                flex items-center
              " id="dropdownMenuButton1" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            <svg className="h-8 w-8 text-red-700"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />  <line x1="4" y1="22" x2="4" y2="15" /></svg>
        </button>
        } 
      </div>
    </div>
  </div>
</nav>
<div className=" shadow-lg rounded-lg  text-gray-700 max-h-75 ">
<section className="overflow-hidden bg-gray-100 text-gray-700 ">
  <div className="container px-5 py-2 mx-auto lg:pt-12 ">
    <div className="flex flex-wrap -m-1 md:-m-2">
      <div className="flex flex-wrap w-1/3 pr-2">
        <div className="w-full p-1 md:p-2">
            <div className="flex justify-center">
              <div className="block p-6 rounded-lg shadow-lg bg-white max-w-sm">
                <div className='flex '>
                  <div className='flex-col-1 px-3 font-semibold justify-items-start'>
                  Overall User Rating: &nbsp; &nbsp; &nbsp;
                  </div>
                  <div className='flex-col-2 justify-items-end'>  
                  <ul className="flex justify-center mt-1">
              <li>
                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="heart" className="w-4 text-red-500 mr-1" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path fill="currentColor" d={Math.round(overallRatingReview) > 0 ? filled_color : unfilled_color}></path>
                </svg>
              </li>
              <li>
                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="heart" className="w-4 text-red-500 mr-1" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path fill="currentColor" d={Math.round(overallRatingReview) > 1 ? filled_color : unfilled_color}></path>
                </svg>
              </li>
              <li>
                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="heart" className="w-4 text-red-500 mr-1" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path fill="currentColor" d={Math.round(overallRatingReview) > 2 ? filled_color : unfilled_color}></path>
                </svg>
              </li>
              <li>
                <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="heart" className="w-4 text-red-500 mr-1" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path fill="currentColor" d={Math.round(overallRatingReview) > 3 ? filled_color : unfilled_color}></path>
                </svg>
              </li>
              <li>
                <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="heart" className="w-4 text-red-500" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path fill="currentColor" d={Math.round(overallRatingReview) > 4 ? filled_color : unfilled_color}></path>
                </svg>
              </li>

            </ul>
                  </div>
                </div>
                <div className='flex '>
                  <div className='flex-col-1 px-3 justify-items-start font-semibold py-2'>
                  Landlord Rating: &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                  </div>
                  <div className='flex-col-2 justify-items-end'>  
                  <ul className="flex justify-center py-3">
              <li>
                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="heart" className="w-4 text-red-500 mr-1" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path fill="currentColor" d={Math.round(landlordRating) > 0 ? filled_color : unfilled_color}></path>
                </svg>
              </li>
              <li>
                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="heart" className="w-4 text-red-500 mr-1" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path fill="currentColor" d={Math.round(landlordRating) > 1 ? filled_color : unfilled_color}></path>
                </svg>
              </li>
              <li>
                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="heart" className="w-4 text-red-500 mr-1" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path fill="currentColor" d={Math.round(landlordRating) > 2 ? filled_color : unfilled_color}></path>
                </svg>
              </li>
              <li>
                <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="heart" className="w-4 text-red-500 mr-1" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path fill="currentColor" d={Math.round(landlordRating) > 3 ? filled_color : unfilled_color}></path>
                </svg>
              </li>
              <li>
                <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="heart" className="w-4 text-red-500" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path fill="currentColor" d={Math.round(landlordRating) > 4 ? filled_color : unfilled_color}></path>
                </svg>
              </li>
            </ul>
                  </div>
                </div>
                <div className="flex justify-center py-2">
              <ul className="bg-white rounded-lg w-96 text-gray-900">
              <li className="px-6 py-2 border-b border-gray-200 w-full flex"> &nbsp; &nbsp; &nbsp; &nbsp; Neighborhood &nbsp; &nbsp; &nbsp;
                <div className='px-4 '>
                  {
                    neighborhood > 2.5 ? <svg className="h-8 w-6 text-green-500"  viewBox="0 0 24 24"  fill="none"  
                    stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">  
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></svg>
                      :
                      <svg className="h-8 w-6 text-red-500"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  
                      stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">  
                      <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" /></svg>
                  }
                </div>
                </li>
                <li className="px-6 py-2 border-b border-gray-200 w-full flex"> &nbsp; &nbsp; &nbsp; &nbsp; Crowdedness &nbsp; &nbsp; &nbsp; &nbsp;
                <div className='px-4 '>
                {
                    crowdedness > 2.5 ? <svg className="h-8 w-6 text-green-500"  viewBox="0 0 24 24"  fill="none"  
                    stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">  
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></svg>
                      :
                      <svg className="h-8 w-6 text-red-500"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  
                      stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">  
                      <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" /></svg>
                  }
                </div>
                </li>
                <li className="px-6 py-2 border-b border-gray-200 w-full flex"> &nbsp; &nbsp; &nbsp; &nbsp; Cleanliness &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                {
                    cleanliness > 2.5 ? <svg className="h-8 w-6 text-green-500"  viewBox="0 0 24 24"  fill="none"  
                    stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">  
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></svg>
                      :
                      <svg className="h-8 w-6 text-red-500"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  
                      stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">  
                      <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" /></svg>
                  }
                </li>
                <li className="px-6 py-2 border-b border-gray-200 w-full flex"> &nbsp; &nbsp; &nbsp; &nbsp; Accessabilty &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 
                {
                    accessibility > 2.5 ? <svg className="h-8 w-6 text-green-500"  viewBox="0 0 24 24"  fill="none"  
                    stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">  
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></svg>
                      :
                      <svg className="h-8 w-6 text-red-500"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  
                      stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">  
                      <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" /></svg>
                  }
                </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-2/3 ">
        <div className=" w-full p-1 md:p-2">
          <div className="flex justify-center w-full ">
            <div className="block p-6 rounded-lg shadow-lg bg-white max-w-3xl w-full  overflow-y-auto overscroll-auto h-60 break-all">
              <h5 className="text-gray-900 text-xl leading-tight text-center font-medium mb-2">Review</h5>
                <p className="text-gray-700 text-base mb-4 break-normal">
                  {textReview}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  </div>
</div>
  )
}

export default Property_detail_reviews