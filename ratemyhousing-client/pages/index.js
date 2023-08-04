import Head from 'next/head'
import Header from '../components/Header'
import SearchForm from '../components/SearchForm'
import Image from 'next/image'

export default function Home() {

  return (
    <div >
      <Head>
        <title>Rate my property</title>
        <meta name="description" content="Rate my Property" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-wrap mb-6" style={{  position: 'relative' }}>
        {/* Header */}
        <Header />
      </div>
      
      {/* Search Form */}
      <SearchForm />
      </div>

  )
}