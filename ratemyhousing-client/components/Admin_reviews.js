import React from 'react'
import Admin_rev from './Admin_rev'

const Admin_reviews = ({reviews,arr}) => {

  console.log("reviwes",arr)
  return (
    <div className='flex  border-gray-700 py-10 self-center justify-center'>
        <div className='ml-8 mb-3 '>

            {/* { reviews.map(result => < Admin_rev key={result.id} 
                            review_string={result.review_string} 
                            property_id={result.property_id} 
                            review_id={result.review_id} 
                            admin_check={result.admin_check}
                            hide={result.hide}/> 
            )} */}

            { arr ? arr.map(result => <Admin_rev
                                    property_id = {result.parent_property_id}
                                    review_string={result.textReview}
                                    review_id={result._id}
                                    
                                  />
              ) :
              <div></div>
            }

        </div>
    </div>
  )
}

export default Admin_reviews