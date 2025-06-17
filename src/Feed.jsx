import { signOut } from "firebase/auth";
import { auth } from "./firebase"; 
import { useNavigate } from "react-router-dom";
import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useState } from "react";

function Feed() {
  const navigate = useNavigate();
  const [tweetText, setTweetText] = useState("");
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  const handlePost  = async() => {
  if (!tweetText.trim()) return;

  try {
    await addDoc(collection(db, "posts"), {
      content: tweetText,
      userId: auth.currentUser.uid,
      createdAt: serverTimestamp(),
    });

    // ✅ Clear the input
    setTweetText("");
    }
    catch (error){
      console.error("Error Handling Post:", error);
    }
  }
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Welcome to your Twitter Feed!</h1>
      <p>No tweets yet. Start posting!</p>
        <textarea
        value={tweetText}
        onChange={(e) => setTweetText(e.target.value)}
        placeholder="What's happening?"
        rows={3}
      />
      <br />
      <button onClick={handlePost}>Post</button>
      <br />
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
}
export default Feed;