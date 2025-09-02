import { useParams, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { type Post, getPostsByTopic } from "../services/post";

const TopicDetail: React.FC = () => {
  const { topic } = useParams<{ topic: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    if (topic) {
      getPostsByTopic(topic)
        .then(setPosts)
        .catch(console.error);
    }
  }, [topic]);

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-[#1d2129] p-6 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6 text-blue-400">{topic}</h1>
      <ul className="space-y-4">
        {posts.map((post) => (
          <li
            key={post._id}
            className="p-4 bg-[#2a2f3a] rounded-lg hover:bg-[#333947] transition"
          >
            <h2 className="text-lg font-semibold hover:underline cursor-pointer text-white" onClick={()=>navigate(`../post/${post._id}`)}>{post.title}</h2>
            <p className="text-gray-300 line-clamp-2">{post.content}</p>
            <p className="text-xs text-gray-500 mt-2">
              {new Date(post.createdAt).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopicDetail;
