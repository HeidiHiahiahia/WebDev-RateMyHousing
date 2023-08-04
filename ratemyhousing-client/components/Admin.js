import React from 'react'
import Admin_properties from './Admin_properties'
import Admin_nav from './Admin_nav'

const Admin = ({properties,arr}) => {

    const url_1 = "https://photos.zillowstatic.com/fp/6adb4f85831be8feb2c375a0eb41314c-uncropped_scaled_within_1536_1152.webp"
 
  console.log("Component",arr)
    return (
    <div>
        <Admin_nav />
        {/* Properties */}
        <div className='py-8 px-8 '>
            <div className='grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 m-8 '>
            {/* { properties ? properties.map(result => <Admin_properties 
                      key = {result.id}
                      property_id = {result.property_id}
                      house_type = {result.house_type}
                      address = {result.address}
                      img_url = {result.pictures}
            />): <div></div> }   */}
              { arr ? arr.map(result => <Admin_properties
                                    property_id = {result._id}
                                    house_type = {result.propertyType}
                                    address_city = {result.address.city}
                                    adress_street = {result.address.street}
                                    adress_state = {result.address.state}
                                    img_url = {result.pictures}
                                  />
              ) :
              <div></div>
            }
            </div>
        </div>
    </div>
  )
}

export default Admin