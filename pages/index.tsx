import Head from 'next/head'
import HomeGrid from '@/components/HomeGrid'

export default function Home() {
  return (
    <>
      <Head>
        <title>MarxDB | Home</title>
        <meta name="keywords" content="marx" />
        </Head>
        <div className="container-fluid">
          <HomeGrid />
        </div>
    </>
  )
}
