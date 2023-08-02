"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { Tweet } from "./global";

export default function Likes({
  tweet,
  addOptimisticTweet,
}: {
  tweet: TweetWithAuthor;
  addOptimisticTweet: (newTweet: TweetWithAuthor) => void;
}) {
  const router = useRouter();
  const handleLikes = async () => {
    const supabase = createClientComponentClient<Database>();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      if (tweet.user_has_liked) {
        addOptimisticTweet({
          ...tweet,
          likes: tweet.likes - 1,
          user_has_liked: !tweet.user_has_liked,
        });
        await supabase
          .from("likes")
          .delete()
          .match({ user_id: user.id, tweet_id: tweet.id });
      } else {
        addOptimisticTweet({
          ...tweet,
          likes: tweet.likes + 1,
          user_has_liked: !tweet.user_has_liked,
        });
        await supabase
          .from("likes")
          .insert({ user_id: user.id, tweet_id: tweet.id });
      }
      router.refresh();
    }
  };

  return <button onClick={handleLikes}>{tweet.likes} Likes</button>;
}
