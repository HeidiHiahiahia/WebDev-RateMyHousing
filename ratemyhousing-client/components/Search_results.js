import React from 'react'
import Search_Properties from './Search_Properties'
import FooterSearch from './FooterSearch'


const Search_results = ({arr}) => { 
  console.log(arr)
  return (
    <div className='flex flex-col justify-between'>
        <div className='px-8 py-8'>
            <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4  m-8 '>
              { arr.map(result => <Search_Properties
                                    p_id = {result._id}
                                    house_type = {result.propertyType}
                                    address_city = {result.address.city}
                                    adress_street = {result.address.street}
                                    adress_state = {result.address.state}
                                    overall_rating = {result.overallRating}
                                    img_url = {result.pictures}
                                    totalReviewCount = {result.totalReviewCount}
                                  />
              )}
            </div>
        </div>
        {/* Footer For the search */}
        <div className="flex flex-col items-center">
          <FooterSearch />
        </div>
    </div>
  )
}

export default Search_results