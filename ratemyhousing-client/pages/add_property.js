import Head from 'next/head'
import Header from '../components/Header'
import PropertyForm from '../components/PropertyForm'

function add_property() {
    return (
        <div>
            <div className='bgimg5'>
            <Head>
                <title>Rate my property</title>
                <meta name="description" content="Add a new property" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
          <div>
              {/* Header */}
            <Header />

{/* Property Form */}
<PropertyForm />
          </div>
            
        </div>
        </div>
        
    )
}

export default add_property