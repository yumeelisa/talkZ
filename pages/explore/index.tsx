import { useQuery } from "@apollo/client";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Post from "../../components/Post";
import PostsList from "../../components/PostsList";
import SubtalkzItem from "../../components/SubtalkzItem";
import SubtalkzList from "../../components/SubtalkzList";
import {
  GET_ALL_SUBTALKZ,
  SEARCH_POSTS,
  SEARCH_SUBTALKZ,
} from "../../graphql/queries";
import { IPost, Subtalkz } from "../../interface";

const ExplorePage = () => {
  const router = useRouter();
  const { q } = router.query;
  const { data: subtalkz } = useQuery(SEARCH_SUBTALKZ, {
    variables: {
      q: `%${q}%`,
    },
  });
  const { data: items } = q
    ? useQuery(SEARCH_POSTS, {
        variables: {
          q: `%${q}%`,
        },
      })
    : useQuery(GET_ALL_SUBTALKZ);
  console.log(subtalkz);

  return (
    <div className="max-w-7xl mx-auto">
      <Head>
        <title>Explore</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="relative pt-4 lg:pt-24 max-w-[642px] mx-auto px-4 lg:px-0">
        <div className="space-y-4">
          {q ? (
            <>
              <SubtalkzList items={subtalkz?.getTalkZ_subtalkzListBySearch} />

              <PostsList posts={items?.getTalkZ_postListBySearch} />
            </>
          ) : (
            <div>
              <h1 className="text-gray-400 text-lg font-bold md:text-2xl mb-4 text-center ">
                Select topics you're interested in
              </h1>
              <SubtalkzList items={items?.getTalkZ_subtalkzList} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
