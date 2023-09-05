"use client";
function TweetInput() {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.value = "";
    }
  };
  return (
    <input
      name="title"
      className="bg-inherit flex-1 ml-2 text-2xl leading-loose placeholder-gray-500 px-2"
      placeholder="What is happening?!"
      onKeyUp={handleKeyPress}
    />
  );
}

export default TweetInput;
