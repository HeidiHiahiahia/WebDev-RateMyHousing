function DefaultFooter(){
    return (
        <footer className="flex flex-col text-white bg-black">
            <div className="p-6 bottom-0">
                <p className="flex justify-center items-center">
                    <span className="mr-4">Register for free</span>
                    <a href="/register">
                        <button type="button" className="inline-block px-6 py-2 border-2 border-white text-white 
                        font-medium text-xs leading-tight uppercase rounded-full hover:bg-black hover:bg-opacity-5 
                        focus:outline-none focus:ring-0 transition duration-150 ease-in-out">
                        Sign up!
                        </button>
                    </a>
                </p>
            </div>
        </footer>
    )
}


export default DefaultFooter;