import { useMutation, useQuery } from '@apollo/client';
import { useSession } from 'next-auth/react';
import Head from 'next/head'
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { BiCommentDetail } from 'react-icons/bi';
import { BsArrowDownShort, BsArrowUpShort } from 'react-icons/bs';
import { useRecoilState } from 'recoil';
import TimeAgo from 'timeago-react';
import client from '../../apollo-client';
import { openCommentState } from '../../atom/openComment';
import Post from '../../components/Post';
import { ADD_COMMENT } from '../../graphql/mutations';
import { GET_POST_BY_ID, GET_USER_BY_EMAIL } from '../../graphql/queries';

const PostDetails = () => {
    const { data:session } = useSession();

    const router = useRouter();
    const { postId } = router.query;
    const { data } = useQuery(GET_POST_BY_ID,{
        variables:{
            id:postId
        }
    });


    const [commentNum,setCommentNum] = useState<number>(3);
    const showMoreComment = () => {
        setCommentNum(prev => prev+3);
    }

    const showLessComment = () => {
        setCommentNum(3);
    }

    const [openComment] = useRecoilState(openCommentState);
    const [comment,setComment] = useState<string>("");
    const [addComment] = useMutation(ADD_COMMENT,{
        refetchQueries:[GET_POST_BY_ID,'getTalkZ_post']
    })


    console.log(data?.getTalkZ_post);

    const submitComment = async() => {
        const toastId = toast.loading("Posting your comment...");
        try {
            const { data:{ getTalkz_userByEmail: user } } = await client.query({
                query: GET_USER_BY_EMAIL,
                variables:{
                    email:session?.user?.email
                }
            })
            await addComment({
                variables:{
                    post_id:postId,
                    username:session?.user?.name,
                    text:comment,
                    user_id:user?.id
                }
            });
            toast.success("Comment successfully posted",{
                id:toastId
            })
        } catch(err) {
            toast.error("There's an error creating the comment",{
                id:toastId
            })
        } finally {
            setComment("");
        }
        

      
     
    }
  return (
    <main className="max-w-2xl mx-auto px-4">
        <Head>
            <title>Post Details</title>
            <meta name="description" content="Generated by create next app" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className=' pt-4   lg:pt-20 relative text-gray-400 group'>
            <Post post={data?.getTalkZ_post} />
            <div className="bg-[#1E293B] -mt-4 shadow-sm cursor-pointer group-hover:bg-[#1b2433]  transition-all ease-in-out duration-100 py-4 px-[42px]">
                {session && (
                    <p>Comment as <span className='text-[#0EA5E9] font-semibold'>{session?.user?.name}</span></p>
                )}
                <form className='w-full flex flex-col space-y-2' onSubmit={(e)=>{
                    e.preventDefault();
                    submitComment();
                }} >
                    <textarea name="" id="" disabled={!session} placeholder={`${session ? "Write your comment..." : "Please sign in first to comment"}`} className='rounded-xl text-gray-400 border-t border-gray-700 shadow-md px-2 md:px-4 py-1 md:py-2  outline-none bg-transparent w-full my-2' value={comment} onChange={(e)=>setComment(e.target.value)}></textarea>
                    <button className='bg-[#0EA5E9] whitespace-nowrap font-bold text-white rounded-full p-2 hover:bg-[#0999db]' type="submit">Comment</button>
                </form>
               
                <div className={` ${openComment ? "block" : "hidden"} mt-4 space-y-2`}>
                    <h1 className="text-lg font-semibold ">Comments:</h1>
                    {data?.getTalkZ_post?.talkz_commentList?.length === 0 && (
                        <p>Be the first to comment</p>
                    )}
                    <div className='space-y-4'>
                    {data?.getTalkZ_post?.talkz_commentList?.slice(0,commentNum).map((comment:any)=>(
                        <>
                            <div key={comment?.id} className="flex flex-col gap-y-2">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-x-2">
                                        <Image src={comment?.talkZ_user?.image || ""} alt={comment.talkZ_user?.name} width={35} height={35} className=" rounded-full" />
                                        <p>{comment?.talkZ_user?.name}</p>
                                    </div>

                
                                    <TimeAgo 
                                        datetime={comment.created_at}
                                        className="text-gray-700 text-sm"
                                    />
                                </div>
                                <p className="text-">{comment.text}</p>

                        
                            </div>
                        </>
                  
                    ))}
                    {data?.getTalkZ_post?.talkz_commentList?.length >= 3 && (
                        <p onClick={()=>{
                            commentNum >= data?.getTalkZ_post?.talkz_commentList?.length ? showLessComment() : showMoreComment()
                        }} className="text-center text-lg font-bold">{ commentNum >= data?.getTalkZ_post?.talkz_commentList?.length ? "Show less" : "Show more"}
                        </p>
                    )}
                 

                    </div>
                    
            </div>
            </div>

        </div>
        

    </main>
  )
}

export default PostDetails