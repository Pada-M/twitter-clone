import React, { useState, useEffect } from 'react'; // Import useEffect
import { signOut } from "firebase/auth";
import { auth, db } from "./firebase"; // Ensure db is imported
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } from "firebase/firestore"; // Import onSnapshot, query, orderBy
import { useNavigate } from "react-router-dom";
import Posts from './Posts'; // Import the Post component

function Feed() {
  const navigate = useNavigate();
  const [tweetText, setTweetText] = useState("");
  const [posts, setPosts] = useState([]); // State to store fetched posts
  const [loadingPosts, setLoadingPosts] = useState(true); // Loading state for posts
  const [postsError, setPostsError] = useState(null); // Error state for posts

  // --- useEffect for fetching posts in real-time ---
  useEffect(() => {
    // 1. Create a query to the 'posts' collection, ordered by createdAt
    const postsQuery = query(
      collection(db, "posts"),
      orderBy("createdAt", "desc") // Order by newest first
    );

    // 2. Set up a real-time listener using onSnapshot
    const unsubscribe = onSnapshot(
      postsQuery,
      (snapshot) => {
        const fetchedPosts = snapshot.docs.map((doc) => ({
          id: doc.id, // Important: get the document ID
          ...doc.data(), // Spread all other fields
        }));
        setPosts(fetchedPosts);
        setLoadingPosts(false); // Data loaded, set loading to false
      },
      (error) => {
        console.error("Error fetching posts:", error);
        setPostsError("Failed to load posts."); // Set error message
        setLoadingPosts(false); // Stop loading even if there's an error
      }
    );

    // 3. Return a cleanup function
    // This function runs when the component unmounts or before the effect re-runs
    return () => unsubscribe();
  }, []); // Empty dependency array means this runs only once on mount and cleans up on unmount

  // --- handleSignOut function (remains the same) ---
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // --- handlePost function (remains the same, but now affects the real-time listener) ---
  const handlePost = async () => {
    if (!tweetText.trim()) return;

    try {
      await addDoc(collection(db, "posts"), {
        content: tweetText,
        userId: auth.currentUser.uid, // Make sure auth.currentUser is available
        createdAt: serverTimestamp(),
      });
      setTweetText(""); // Clear the input after successful post
    } catch (error) {
      console.error("Error Handling Post:", error);
      // You might want to add a user-facing error message here
    }
  };

  // --- JSX for rendering ---
  return (
    <div className="p-4 max-w-xl mx-auto bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-extrabold text-blue-600 mb-6 text-center">
        Twitter Clone Feed
      </h1>

      {/* Tweet Input Area */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <textarea
          value={tweetText}
          onChange={(e) => setTweetText(e.target.value)}
          placeholder="What's happening?"
          rows={3}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
        />
        <div className="flex justify-between items-center">
          <button
            onClick={handlePost}
            className="px-6 py-2 bg-blue-500 text-white rounded-full font-bold hover:bg-blue-600 transition duration-200"
          >
            Post Tweet
          </button>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-red-500 text-white rounded-full font-bold hover:bg-red-600 transition duration-200"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Posts Display Area */}
      <div className="posts-section">
        <h2 className="text-xl font-bold mb-4 text-gray-700">Recent Tweets</h2>
        {loadingPosts && <p className="text-center text-gray-500">Loading tweets...</p>}
        {postsError && <p className="text-center text-red-500">{postsError}</p>}
        {!loadingPosts && posts.length === 0 && !postsError && (
          <p className="text-center text-gray-500">No tweets yet. Be the first to post!</p>
        )}
        {posts.map((post) => (
          <Posts key={post.id} {...post} />
        ))}
      </div>
    </div>
  );
}

export default Feed;