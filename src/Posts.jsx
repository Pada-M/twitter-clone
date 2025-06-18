// src/components/Post.jsx
import React from 'react';

function Post({ content, userId, createdAt }) {
  // Optional: Format timestamp nicely if createdAt is a Firebase Timestamp
  const formattedTime = createdAt?.toDate().toLocaleString();

  // You might want to fetch username/avatar based on userId here or pass it as prop
  // For now, just display userId
  const displayUser = userId.substring(0, 8) + '...'; // Shorten ID for display

  return (
    <div className="border p-3 mb-3 rounded-lg shadow-sm bg-white">
      <div className="flex items-center mb-2">
        {/* Placeholder for Avatar */}
        <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center mr-2 text-sm font-semibold text-blue-800">
          U
        </div>
        <div>
          <p className="font-semibold text-gray-800">User ID: {displayUser}</p>
          {formattedTime && <p className="text-xs text-gray-500">{formattedTime}</p>}
        </div>
      </div>
      <p className="text-gray-700">{content}</p>
    </div>
  );
}

export default Post;