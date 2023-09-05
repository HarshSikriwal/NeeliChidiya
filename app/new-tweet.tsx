import { User, createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import Image from "next/image";
import TweetInput from "./tweet_input";

export const dynamic = "force-dynamic";

export default function NewTweet({ user }: { user: User }) {
  const addTweet = async (formData: FormData) => {
    "use server";
    const title = String(formData.get("title"));

    const supabase = createServerActionClient<Database>({ cookies });

    await supabase.from("tweets").insert({ title, user_id: user.id });
  };
  // const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (e.key === "Enter") {
  //     e.currentTarget.value = "";
  //   }
  // };

  return (
    <form className="border border-gray-800 border-t-0" action={addTweet}>
      <div className="flex py-8 px-4">
        <div className=" h-12 w-12">
          <Image
            src={user.user_metadata.avatar_url}
            alt="user avatar"
            width={48}
            height={48}
            className="rounded-full"
          />
        </div>
        <TweetInput />
      </div>
    </form>
  );
}
