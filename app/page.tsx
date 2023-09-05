import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { cookies } from "next/headers";

import AuthButtonServer from "./auth-button-server";
import { redirect } from "next/navigation";
import NewTweet from "./new-tweet";
import Likes from "./likes";
import Tweets from "./tweets";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { data } = await supabase
    .from("tweets")
    .select("*, author: profiles(*), likes(user_id)")
    .order("created_at", { ascending: false });

  const tweets =
    data?.map((tweet) => ({
      ...tweet,
      author: Array.isArray(tweet.author) ? tweet.author[0] : tweet.author,

      user_has_liked: !!tweet.likes.find((like) => {
        if (session) {
          return like.user_id === session.user.id;
        } else {
          return false;
        }
      }),
      likes: tweet.likes.length,
    })) ?? [];

  return (
    <div className=" w-full max-w-xl mx-auto">
      <div className="flex justify-between px-4 py-6 border border-gray-800 border-t-0">
        <h1 className="text-xl font-bold">Home</h1>
        <AuthButtonServer />
      </div>
      {!session && (
        <div className="flex justify-between border p-4 items-center">
          <p>Please Login To Post Something</p>
          <span className="rounded-lg bg-black font-bold px-4 py-2 text-black">
            <AuthButtonServer />
          </span>
        </div>
      )}
      {session && <NewTweet user={session.user} />}

      <Tweets tweets={tweets} />
    </div>
  );
}
