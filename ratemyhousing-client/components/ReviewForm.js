import React from 'react'
import ReactStars from 'react-stars'
import { useRouter } from 'next/router'

const ReviewForm = () => {

    const router = useRouter()
    // get property id from previous page
    const property_id = router.query.keyword
    var overall_rating = -1;
    var landlord_rating = -1;
    var neighborhood_rating = -1;
    var cleanliness_rating = -1;
    var crowdedness_rating = -1;
    var accessibility_rating = -1;

    const handleOverallRating = async (newRating) => {
        overall_rating = newRating
    }
    const handleLandlordRating = async (newRating) => {
        landlord_rating = newRating
    }
    const handleNeighborhoodRating = async (newRating) => {
        neighborhood_rating = newRating
    }
    const handleCleanlinessRating = async (newRating) => {
        cleanliness_rating = newRating
    }
    const handleCrowdednessRating = async (newRating) => {
        crowdedness_rating = newRating
    }
    const handleAccessibilityRating = async (newRating) => {
        accessibility_rating = newRating
    }
     // Handles the submit event on form submit.
    const handleSubmit = async (event) => {
        // Stop the form from submitting and refreshing the page.
        event.preventDefault()

        let send_request = true
        if(overall_rating == -1
        || landlord_rating == -1
        || neighborhood_rating == -1
        || cleanliness_rating == -1
        || crowdedness_rating == -1
        || accessibility_rating == -1){
            alert("Please provide all ratings")
            send_request = false
        }
        if(send_request){
            // TODO: update endpoint after fetching prop id from previous page
            const data = {
                parent_property_id:property_id,
                overallRatingReview:overall_rating,
                landlordRating:landlord_rating,
                neighborhood:neighborhood_rating,
                crowdedness:crowdedness_rating,
                cleanliness:cleanliness_rating,
                accessibility:accessibility_rating,
                bedNum:parseInt(event.target.beds.value),
                bathNum:parseInt(event.target.baths.value),
                textReview:event.target.detailed_review.value,
                costReview:parseInt(event.target.cost_per_month.value),
            }
            
            const JSONdata = JSON.stringify(data)
            //console.log(JSONdata)
            
            // API endpoint where we send form data.
            // example property id
            // TODO: update endpoint after fetching prop id from previous page
            const endpoint = `${process.env.SERVER_URL}/review/` + property_id
            
            // Form the request for sending data to the server.
            const options = {
                // The method is POST because we are sending data.
                method: 'POST',
                // Tell the server we're sending JSON.
                headers: {
                    'Content-Type': 'application/json',
                },
                // Body of the request is the JSON data we created above.
                body: JSONdata,
            }
            
            // Send the form data to our forms API on Vercel and get a response.
            const response = await fetch(endpoint, options)
            
            // Get the response data from server as JSON.
            // If server returns the name submitted, that means the form works.
            const result = await response.json()
            alert('Thank you, your review was successfully submitted')
            //const property_id_url = '/' + property_id
            //console.log(property_id_url)
            router.push({
                pathname: "/property",
                query: { keyword : property_id}
            })
        }
    }
    return (
        
        <div className="flex flex-col items-center text-gray-900">
            <form className="w-full max-w-lg space-y-5 bg-white px-6 py-8 rounded shadow-md text-gray-600" onSubmit={handleSubmit}>
                <div className="flex flex-col items-center">
                    <label className="formLabel text-xl text-black">
                        ADD A REVIEW
                    </label>
                </div>
                <div className="md:flex md:items-center justify-center mb-6">
                    <div className='md:w-1/3'>
                        <label className="formLabel md:text-right mb-1 md:mb-0 pr-4 text-gray-600" htmlFor="overall_rating">
                            Overall Rating   
                        </label>
                    </div>
                    <div className="md:w-1/2">
                        <ReactStars 
                            count={5} 
                            size={35} 
                            color1={'#CED1D3'}
                            color2={'#ffd700'}
                            required='required'  
                            onChange={handleOverallRating}
                        />
                    </div>
                </div>
                <div className="md:flex md:items-center justify-center mb-6">
                    <div className='md:w-1/3'>
                        <label className="formLabel md:text-right mb-1 md:mb-0 pr-4 text-gray-600" htmlFor="landlord_rating">
                            Landlord Rating        
                        </label>
                    </div>
                    <div className="md:w-1/2">
                        <ReactStars 
                            count={5} 
                            size={35} 
                            color1={'#CED1D3'}
                            color2={'#ffd700'}
                            required='required'
                            onChange={handleLandlordRating}
                        />
                    </div>
                </div>
                <div className="md:flex md:items-center justify-center mb-6">
                    <div className='md:w-1/3'>
                        <label className="formLabel md:text-right mb-1 md:mb-0 pr-4 text-gray-600" htmlFor="neighborhood">
                            Neighborhood        
                        </label>
                    </div>
                    <div className="md:w-1/2">
                        <ReactStars 
                            count={5} 
                            size={35} 
                            color1={'#CED1D3'}
                            color2={'#ffd700'}
                            required='required'
                            onChange={handleNeighborhoodRating}
                        />
                    </div>
                </div>
                <div className="md:flex md:items-center justify-center mb-6">
                    <div className='md:w-1/3'>
                        <label className="formLabel md:text-right mb-1 md:mb-0 pr-4 text-gray-600" htmlFor="crowdedness">
                        Crowdedness        
                        </label>
                    </div>
                    <div className="md:w-1/2">
                        <ReactStars 
                            count={5} 
                            size={35}
                            color1={'#CED1D3'} 
                            color2={'#ffd700'}
                            required='required'
                            onChange={handleCrowdednessRating}
                        />
                    </div>
                </div>
                <div className="md:flex md:items-center justify-center mb-6">
                    <div className='md:w-1/3'>
                        <label className="formLabel md:text-right mb-1 md:mb-0 pr-4 text-gray-600" htmlFor="cleanliness">
                        Cleanliness        
                        </label>
                    </div>
                    <div className="md:w-1/2">
                        <ReactStars 
                            count={5} 
                            size={35} 
                            color1={'#CED1D3'}
                            color2={'#ffd700'}
                            required='required'
                            onChange={handleCleanlinessRating}
                        />
                    </div>
                </div>
                <div className="md:flex md:items-center justify-center mb-6">
                    <div className='md:w-1/3'>
                        <label className="formLabel md:text-right mb-1 md:mb-0 pr-4 text-gray-600" htmlFor="accessibility">
                        Accessibility        
                        </label>
                    </div>
                    <div className="md:w-1/2">
                        <ReactStars 
                            count={5} 
                            size={35} 
                            color1={'#CED1D3'}
                            color2={'#ffd700'}
                            required='required'
                            onChange={handleAccessibilityRating}
                        />
                    </div>
                </div>
                <div className="md:flex md:items-center justify-center mb-6">
                    <div className="md:w-1/3">
                        <label className="formLabel md:text-right mb-1 md:mb-0 pr-4 text-gray-600" htmlFor="cost_per_month">
                            Cost per Month (CAD)
                        </label>
                    </div>
                    <div className="md:w-1/2">
                        <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-3/4 py-2 px-4 
                            text-gray-700 leading-tight focus:outline-none focus:bg-white" 
                            id="cost_per_month" 
                            name="cost_per_month" 
                            type="number" 
                            required="required"
                            min={0}
                        />
                    </div>
                </div>
                <div className="md:flex md:items-center justify-center mb-6">
                    <div className="md:w-1/3">
                        <label className="formLabel md:text-right mb-1 md:mb-0 pr-4 text-gray-600" htmlFor="beds">
                        Beds
                        </label>
                    </div>
                    <div className="md:w-1/2">
                        <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-3/4 py-2 px-4 
                            text-gray-700 leading-tight focus:outline-none focus:bg-white" 
                            id="beds" 
                            name="beds" 
                            type="number" 
                            required="required"
                            min={0}
                        />
                    </div>
                </div>
                <div className="md:flex md:items-center justify-center mb-6">
                    <div className="md:w-1/3">
                        <label className="formLabel md:text-right mb-1 md:mb-0 pr-4 text-gray-600" htmlFor="baths">
                        Baths
                        </label>
                    </div>
                    <div className="md:w-1/2">
                        <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-3/4 py-2 px-4 
                            text-gray-700 leading-tight focus:outline-none focus:bg-white" 
                            id="baths" 
                            name="baths" 
                            type="number" 
                            required="required"
                            min={0}
                        />
                    </div>
                </div>
                <div className="flex flex-wrap mb-6">
                    <label className="formLabel text-gray-600" htmlFor="detailed_review">
                    Detailed Review
                    </label>
                    <textarea className="appearance-none block w-full bg-gray-200 border border-gray-200 
                        rounded py-5 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                        id="detailed_review" 
                        placeholder='Here is your chance to be more specific'
                        required='required'
                    />
                </div>
                <div className="flex flex-col items-center align-middle">
                    <button className="bg-gray-200 hover:bg-white text-gray-800 font-semibold py-3 px-4 
                    border border-gray-400 rounded shadow w-3/12" type="submit">Submit</button>
                </div>
            </form>
        </div>
    )
}

export default ReviewForm
        