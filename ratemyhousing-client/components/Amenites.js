import React from 'react'

const Amenites = ({key, obj,obj_avail}) => {

  //console.log(obj)
  return (
    <div>
    { 
      (obj_avail === true) &&  
        <span className="px-2 py-2 rounded-full text-gray-400 
                        font-semibold text-sm flex align-center w-max cursor-pointer
                        active:bg-gray-300 transition duration-300 ease">
        {obj}
        </span> 
    } 
    </div>
  )
}

export default Amenites