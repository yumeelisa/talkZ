import { useMutation } from '@apollo/client'
import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import Image from 'next/image'
import { useEffect } from 'react'
import client from '../apollo-client'
import CreatePost from '../components/CreatePost'
import Header from '../components/Header'
import HomeFeed from '../components/HomeFeed'
import { ADD_NEW_USER } from '../graphql/mutations'
import { GET_USER_BY_EMAIL } from '../graphql/queries'


const Home: NextPage = () => {
  const { data:session } = useSession();
  console.log(session)

  const [addUser] = useMutation(ADD_NEW_USER);
  console.log(session?.user?.email)
  useEffect(() => {
      const addNewUser = async() => {
        try {
          if(session) {
            const { data: { getTalkz_userListByEmail } } = await client.query({
              query: GET_USER_BY_EMAIL,
              variables: {
                  email:session?.user?.email
            }})
            console.log(getTalkz_userListByEmail)

            const userExist = getTalkz_userListByEmail?.length > 0;

            if(!userExist) {
               await addUser({
                variables:{
                  name:session?.user?.name,
                  email:session?.user?.email,
                  image:session?.user?.image
                }
              })
            } else {
              return 
            }

          }
    
        } catch(err) {
          console.log(err);
        }
      }

      addNewUser();
  },[])

  return (
    <div className="max-w-7xl mx-auto">
      <Head>
        <title>Home</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className=' relative max-w-[642px] mx-auto px-4 lg:px-0 '>
        <CreatePost />
        <HomeFeed />
      </div>

   
     
    </div>
  )
}



export default Home
