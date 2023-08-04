import React, { useRef } from 'react'
import { useRouter } from 'next/router'
import cookieCutter from 'cookie-cutter'
import AWS from "aws-sdk"

function handleTokenExpiry(status,refreshToken){
    if(status === 403){
        //console.log(`Refresh token ${refreshToken}`)
        refreshTokenRequest(refreshToken).then((res)=>{
            //console.log(`new accessToken ${res.data.token}`);
            cookieCutter.set('token', res.data.token);
            return res.status
            //console.log(`new accessToken ${res.data.token}`);
        },(errStatus)=>{
            //console.log(errStatus);
            return errStatus;
        })
    }else{
        
        return status
    }
}

async function addNewPropertyRequest(JSONdata,token1){
    // API endpoint where we send form data.
    const endpoint = `${process.env.SERVER_URL}/property`

    // Form the request for sending data to the server.
    const options = {
        // The method is POST because we are sending data.
        method: 'POST',
        // Tell the server we're sending JSON.
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token1}`
        },
        // Body of the request is the JSON data we created above.
        body: JSONdata,
    }
    
    // Send the form data to our forms API on Vercel and get a response.
    const response = await fetch(endpoint, options)

    // Get the response data from server as JSON.
    // If server returns the name submitted, that means the form works.
    const result = await response.json()
    // console.log(result)
    return new Promise((resolve, reject) => {
        if(result.status === 201){
            resolve(result.status)
        }
        else {
            reject(result.status) 
        }
    })
}


async function refreshTokenRequest(refreshToken){
    // API endpoint where we send form data.
    const endpoint = `${process.env.SERVER_URL}/auth/token`
    const payload = {
        token: refreshToken
    }
    let payLoadStr = JSON.stringify(payload);
    // console.log(payLoadStr);
    // Form the request for sending data to the server.
    const options = {
        // The method is POST because we are sending data.
        method: 'POST',
        // Tell the server we're sending JSON.
        headers: {
            'Content-Type': 'application/json'
        },
        // Body of the request is the JSON data we created above.
        body: payLoadStr
    }
    
    // Send the form data to our forms API on Vercel and get a response.
    const response = await fetch(endpoint, options)

    // Get the response data from server as JSON.
    // If server returns the name submitted, that means the form works.
    const result = await response.json()
    // console.log(result)
    return new Promise((resolve, reject) => {
        if(result.status === 200){
            resolve(result)
        }
        else {
            reject(result.status) 
        }
    })
}

function PropertyForm() {
    const fileInput = useRef(null)
    const router = useRouter()
    const [disable, setDisable] = React.useState(false);

    // const [token, setToken] = useState("")
    // const [refresh, setRefreshToken] = useState("")

    const s3 = new AWS.S3({
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey:process.env.SECRET_KEY,
        region:process.env.REGION,
    })
     // Handles the submit event on form submit.
    const handleSubmit = async (event) => {
        // Stop the form from submitting and refreshing the page.
        event.preventDefault()
        setDisable(true)

        // Token 1 is the access token
        const token1 = cookieCutter.get('token')
        // Token 2 is refresh token
        const token2 = cookieCutter.get('refreshtoken')

        // Get data from the form.
        const amenities = [
            {
                amenity: "In-unit Laundry",
                available:event.target.in_unit_laundry.checked
            },
            {
                amenity: "Swimming Pool",
                available:event.target.swimming_pool.checked
            },
            {
                amenity: "Gym/fitness center",
                available:event.target.gym.checked
            },
            {
                amenity: "Security Cameras",
                available: event.target.security_cameras.checked
            },
            {
                amenity: "Concierge",
                available:event.target.concierge.checked
            },
            {
                amenity: "Patio",
                available:event.target.patio.checked
            },
            {
                amenity: "Guest Parking",
                available:event.target.guest_parking.checked
            },
            {
                amenity: "Heater",
                available:event.target.heater.checked
            },
            {
                amenity: "Air conditioning (cooling)",
                available:event.target.ac.checked
            },
            {
                amenity: "Dishwasher",
                available:event.target.dishwasher.checked
            },
            {
                amenity: "Gaming Room",
                available:event.target.gaming_room.checked
            },
            {
                amenity: "Jacuzzi",
                available:event.target.jacuzzi.checked
            },
            {
                amenity: "Pet friendly",
                available:event.target.pet_friendly.checked
            },
            {
                amenity: "Mail room",
                available:event.target.mail_room.checked
            },
            {
                amenity: "Club house",
                available:event.target.club_house.checked
            },
        ]

        const address = {
            country: "Canada",
            state: event.target.province.value,
            street: event.target.address1.value,
            city: event.target.city.value,
            postalCode: event.target.zip.value,
        }

        let dataToSend =  {
            name: event.target.property.value,
            propertyType: event.target.property_type.value,
            landlord: event.target.landlord.value,
            propertyManagement: event.target.property_management.value,
            propertyWebsite: event.target.property_website.value,
            address: address,
            amenities: amenities,
        }

        // check if a file is uploaded
        let file = fileInput.current.files[0]


        
        // if there is a file
        if(file){
            // handling uploaded image
            let fileExt = file.name.split('.').pop()
            // folder name + address without spaces + unix timestamp + fileExt
            let newFileName =   'propertyImages/' + 
                                address.street.replaceAll(' ','') + 
                                Date.now().toString() +
                                "." + 
                                fileExt
            
            // params to pass to s3
            const params = { 
                Bucket:process.env.BUCKET_NAME, 
                Key:newFileName,
                Body:file 
            }
            
            // Aws sdk, uploading file to s3 folder
            s3.upload(params, (err, data) => {
                if (err) {
                    //console.log(err)
                }
                else {
                    dataToSend.pictures = [newFileName]
                    const JSONdata = JSON.stringify(dataToSend)
                    // console.log(JSONdata)
                    addNewPropertyRequest(JSONdata,token1).then((status) => {
                        alert('Thank you, your property was successfully submitted')
                        router.push({
                            pathname: "/"
                        })
                    },(status) => {
                        var status = handleTokenExpiry(status,token2);
                        if(status === 401){
                            alert('Session expired please login again');
                            setDisable(false)
                            router.push("/login");
                        }
                        else{
                            alert('Property submission failed, check all the required fields',status);
                            setDisable(false)
                        }
                    })
                }
            })
        }
        else {
            const JSONdata = JSON.stringify(dataToSend)
            // console.log(JSONdata)
            addNewPropertyRequest(JSONdata,token1).then((status) => {
                alert('Thank you, your property was successfully submitted')
                router.push({
                    pathname: "/"
                })
            },(status) => {
                var status = handleTokenExpiry(status,token2);
                if(status === 401){
                    alert('Session expired please login again');
                    setDisable(false)
                    router.push("/login");
                }
                else{
                    alert('Property submission failed, check all the required fields',status);
                    setDisable(false)
                }
            })
        }
    }
    return (
    <div className="flex flex-col items-center">
        <form className="w-full max-w-lg space-y-5 bg-white px-6 py-8 rounded shadow-md " onSubmit={handleSubmit}>
            <div className="flex flex-col items-center">
                <label className="formLabel text-xl text-black" htmlFor="add_a_property">
                    ADD A PROPERTY
                </label>
            </div>
            {/* Line 1,2: Address fields  */}
            <div className="flex flex-wrap mb-6 ">
                <label className="formLabel text-gray-600" htmlFor="address">
                    Address
                </label>
                <input className="appearance-none block w-full bg-gray-200 border border-gray-200 
                    rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 text-gray-600" 
                    id="address1" name="address1"
                    type="text" 
                    placeholder="Street address or P.O Box" 
                    required="required"
                    maxLength={50}
                />
            </div>
            {/* Line 3: City, Province, Postal Code */}
            <div className="flex flex-wrap -mx-3 mb-2">
                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                    <label className="formLabel text-gray-600" htmlFor="grid-city">
                        City
                    </label>
                    <input className="appearance-none block w-full bg-gray-200 border border-gray-200 
                        rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                        id="city" name="city"
                        type="text" 
                        required="required"
                        maxLength={25}
                    />
                </div>
                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                    <label className="formLabel text-gray-600" htmlFor="grid-state">
                        Province
                    </label>
                    <div className="relative">
                        <select className="block text-gray-700 appearance-none w-full bg-gray-200 border border-gray-200 
                        py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white 
                        focus:border-gray-500" 
                        id="province" name="province"
                        required="required">
                        <option></option>
                        <option>Alberta</option>
                        <option>British Columbia</option>
                        <option>Manitoba</option>
                        <option>New Brunswick</option>
                        <option>Newfoundland and Labrador</option>
                        <option>Northwest Territories</option>
                        <option>Nova Scotia</option>
                        <option>Nunavut</option>
                        <option>Ontario</option>
                        <option>Prince Edward Island</option>
                        <option>Quebec</option>
                        <option>Saskatchewan</option>
                        <option>Yukon</option>
                        </select>
                    </div>
                </div>
                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                    <label className="formLabel text-gray-600" 
                    htmlFor="zip">
                        Postal Code
                    </label>
                    <input className="appearance-none block w-full bg-gray-200 border border-gray-200 
                    rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white 
                    focus:border-gray-500" 
                    id="zip" name="zip" 
                    type="text" 
                    required="required" 
                    maxLength={7}    
                    />
                </div>
            </div>
            {/* Line 4: Property Name */}
            <div className="md:flex md:items-center justify-center mb-6">
                <div className="md:w-1/3">
                    <label className="formLabel md:text-right mb-1 md:mb-0 pr-4 text-sm text-gray-600" htmlFor="property">
                        Property Name
                    </label>
                </div>
                <div className="md:w-1/2">
                    <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 
                        text-gray-700 leading-tight focus:outline-none focus:bg-white" 
                        id="property" name="property" 
                        type="text" 
                        maxLength={30}
                    />
                </div>
            </div>
            {/* Line 5: Property Type */}
            <div className="md:flex md:items-center justify-center mb-6">
                <div className="md:w-1/3">
                    <label className="formLabel md:text-right mb-1 md:mb-0 pr-4 text-sm text-gray-600" htmlFor="property_type">
                        Property Type
                    </label>
                </div>
                <div className="md:w-1/2">
                    <select className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 
                        text-gray-700 leading-tight focus:outline-none focus:bg-white"
                        id="property_type" name="property_type"
                        required="required"
                    >
                        <option></option>
                        <option>Apartments/condos/co-ops</option>
                        <option>Townhomes</option>
                        <option>Houses</option>
                    </select>
                </div>
            </div>
            {/* Line 6: Landlord Name */}
            <div className="md:flex md:items-center justify-center mb-6">
                <div className="md:w-1/3">
                    <label className="formLabel md:text-right mb-1 md:mb-0 pr-4 text-sm text-gray-600" htmlFor="landlord">
                        Landlord Name
                    </label>
                </div>
                <div className="md:w-1/2">
                    <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 
                        text-gray-700 leading-tight focus:outline-none focus:bg-white" 
                        id="landlord" name="landlord" 
                        type="text" 
                        maxLength={30}
                    />
                </div>
            </div>
            {/* Line 7: Property Management Name */}
            <div className="md:flex md:items-center justify-center mb-6">
                <div className="md:w-1/3">
                    <label className="formLabel md:text-right mb-1 md:mb-0 pr-4 text-sm text-gray-600" htmlFor="property_management-name">
                        Property Management Name
                    </label>
                </div>
                <div className="md:w-1/2">
                    <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 
                        text-gray-700 leading-tight focus:outline-none focus:bg-white" 
                        id="property_management" name="property_management" 
                        type="text" 
                        maxLength={30}
                    />
                </div>
            </div>
            {/* Line 8: Property Website */}
            <div className="md:flex md:items-center justify-center mb-6">
                <div className="md:w-1/3">
                    <label className="formLabel md:text-right mb-1 md:mb-0 pr-4 text-sm text-gray-600" htmlFor="property_website">
                        Property Website
                    </label>
                </div>
                <div className="md:w-1/2">
                    <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 
                        text-gray-700 leading-tight focus:outline-none focus:bg-white" 
                        id="property_website" 
                        name="property_website" 
                        type="text"
                        maxLength={100}
                    />
                </div>
            </div>
            
            <div className="md:flex md:items-center justify-center mb-6 pb-8">
                <div className="md:w-1/3">
                    <label className="formLabel md:text-right mb-1 md:mb-0 pr-4 text-sm text-gray-600" htmlFor="pictures">
                        Pictures
                    </label>
                </div>
                <div className="md:w-1/2">
                    <input className="form-label inline-block mb-2 text-gray-500"
                        id="picture" 
                        name="picture" 
                        type="file"
                        ref={fileInput} 
                        accept="image/png, image/jpeg"
                    />
                </div>
            </div>
            {/* Line 9: Amenities*/}
            <div className="flex flex-wrap mb-6">
                <label className="formLabel text-lg uppercase text-gray-600" htmlFor="amenities">
                    Amenities
                </label>
            </div>
            {/* In-unit laundry */}
            <div className="checkBoxWithLabel">
                <label className="checkBoxLabel text-gray-600" htmlFor="in_unit_laundry">
                    In-unit laundry
                </label>
                <input id="in_unit_laundry" name="in_unit_laundry" 
                        aria-describedby="in_unit_laundry" 
                        type="checkbox" 
                        className="checkBox"
                />
            </div>
            {/* Swimming pool */}
            <div className="checkBoxWithLabel">
                <label className="checkBoxLabel text-gray-600" htmlFor="swimming_pool">
                    Swimming pool
                </label>
                <input id="swimming_pool" name="swimming_pool" 
                        aria-describedby="swimming_pool" 
                        type="checkbox" 
                        className="checkBox" 
                />
            </div>
            {/* Gym/fitness center */}
            <div className="checkBoxWithLabel">
                <label className="checkBoxLabel text-gray-600" htmlFor="gym">
                    Gym/fitness center
                </label>
                <input 
                    id="gym" name="gym" 
                    aria-describedby="gym" 
                    type="checkbox" 
                    className="checkBox" 
                />
            </div>
            {/* Security Cameras */}
            <div className="checkBoxWithLabel">
                <label className="checkBoxLabel text-gray-600" htmlFor="security_cameras">
                Security cameras
                </label>
                <input 
                    id="security_cameras" name="security_cameras" 
                    aria-describedby="security_cameras" 
                    type="checkbox" 
                    className="checkBox" 
                />
            </div>
            {/* Concierge */}
            <div className="checkBoxWithLabel">
                <label className="checkBoxLabel text-gray-600" htmlFor="concierge">
                Concierge
                </label>
                <input 
                    id="concierge" name="concierge" 
                    aria-describedby="concierge" 
                    type="checkbox" 
                    className="checkBox" 
                />
            </div>
            {/* Patio */}
            <div className="checkBoxWithLabel">
                <label className="checkBoxLabel text-gray-600" htmlFor="patio">
                Patio
                </label>
                <input 
                    id="patio" name="patio" 
                    aria-describedby="patio" 
                    type="checkbox" 
                    className="checkBox" 
                />
            </div>
            {/* Guest parking */}
            <div className="checkBoxWithLabel">
                <label className="checkBoxLabel text-gray-600" htmlFor="guest_parking">
                Guest parking
                </label>
                <input 
                    id="guest_parking" name="guest_parking" 
                    aria-describedby="guest_parking" 
                    type="checkbox" 
                    className="checkBox" 
                />
            </div>
            {/* Heater */}
            <div className="checkBoxWithLabel">
                <label className="checkBoxLabel text-gray-600" htmlFor="heater">
                Heater
                </label>
                <input 
                    id="heater" name="heater" 
                    aria-describedby="heater" 
                    type="checkbox" 
                    className="checkBox" 
                />
            </div>
            {/* Air conditioning (cooling) */}
            <div className="checkBoxWithLabel">
                <label className="checkBoxLabel text-gray-600" htmlFor="ac">
                Air conditioning 
                </label>
                <input 
                    id="ac" name="ac" 
                    aria-describedby="ac" 
                    type="checkbox" 
                    className="checkBox" 
                />
            </div>
            {/* Dishwasher */}
            <div className="checkBoxWithLabel">
                <label className="checkBoxLabel text-gray-600" htmlFor="dishwasher">
                Dishwasher
                </label>
                <input 
                    id="dishwasher" name="dishwasher" 
                    aria-describedby="dishwasher" 
                    type="checkbox" 
                    className="checkBox" 
                />
            </div>
            {/* Gaming Room */}
            <div className="checkBoxWithLabel">
                <label className="checkBoxLabel text-gray-600" htmlFor="gaming_room">
                Gaming room
                </label>
                <input 
                    id="gaming_room" name="gaming_room" 
                    aria-describedby="gaming_room" 
                    type="checkbox" 
                    className="checkBox" 
                />
            </div>
            {/* Jacuzzi */}
            <div className="checkBoxWithLabel">
                <label className="checkBoxLabel text-gray-600" htmlFor="jacuzzi">
                Jacuzzi
                </label>
                <input 
                    id="jacuzzi" name="jacuzzi" 
                    aria-describedby="jacuzzi" 
                    type="checkbox" 
                    className="checkBox" 
                />
            </div>
            {/* Pet friendly */}
            <div className="checkBoxWithLabel">
                <label className="checkBoxLabel text-gray-600" htmlFor="pet_friendly">
                Pet friendly
                </label>
                <input 
                    id="pet_friendly" name="pet_friendly" 
                    aria-describedby="pet_friendly" 
                    type="checkbox" 
                    className="checkBox" 
                />
            </div>
            {/* Mail room */}
            <div className="checkBoxWithLabel">
                <label className="checkBoxLabel text-gray-600" htmlFor="mail_room">
                Mail room
                </label>
                <input 
                    id="mail_room" name="mail_room" 
                    aria-describedby="mail_room" 
                    type="checkbox" 
                    className="checkBox" 
                />
            </div>
            {/*  Club house */}
            <div className="checkBoxWithLabel">
                <label className="checkBoxLabel text-gray-600" htmlFor="club_house">
                Club house
                </label>
                <input 
                    id="club_house" name="club_house" 
                    aria-describedby="club_house" 
                    type="checkbox" 
                    className="checkBox" 
                />
            </div>
          {/* Last line: Submit */}
            <div className="flex flex-col items-center align-middle">
                <button className="bg-gray-200 hover:bg-white text-gray-800 font-semibold py-3 px-4 
                border border-gray-400 rounded shadow w-3/12" 
                type="submit"
                disabled={disable}>
                    Submit
                </button>
            </div>
        </form>
    </div>
    )
}

export default PropertyForm
