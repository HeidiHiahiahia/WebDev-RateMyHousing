import Head from 'next/head'
import Header from '../components/Header'
import ReviewForm from '../components/ReviewForm'

function add_review() {
    return (
        <div className='bgimg5'>
            <Head>
                <title>Add a Review</title>
                <meta name="description" content="Add a new review" />
                <link rel="icon" href="/favicon.ico" />
                </Head>

                <div>
                    {/* Header */}
            <Header />
                </div>
             

            {/* Review Form */}
            <ReviewForm />
        </div>
    )
}

export default add_review