import { useEffect, useState } from "react";
import { getPopularPosts } from "../services/post";
import { Link } from "react-router-dom";

const Popular = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
  getPopularPosts(limit, page)
    .then((data) => setPosts(data.posts)) 
    .catch(console.error);
}, [page]);


  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Popular Articles</h1>

      {posts.length > 0 ? (
        <div className="space-y-6">
          {posts.map((post) => (
            <div
                key={post._id}
                className="p-6 bg-white rounded-lg shadow hover:shadow-md transition h-[190px] flex flex-col"
            >
            <h2 className="text-2xl font-semibold mb-2 break-words">
                <Link to={`/post/${post._id}`} className="hover:underline">
                {truncateText(post.title, 60)}
                </Link>
            </h2>

            <p className="text-gray-700 mb-4 break-words flex-grow">
                {truncateText(post.content, 190)}
            </p>

            {/* Phần này sẽ dính dưới cùng */}
            <div className="mt-auto flex justify-between items-center text-sm text-gray-500">
                <span>👍 {post.likes.length} likes</span>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                {post.author && (
                <Link
                    to={`/user/${post.author._id}`}
                    className="flex items-center gap-2 hover:underline"
                >
                    <img
                    src={post.author.avatarUrl || "/default-avatar.png"}
                    alt={post.author.username}
                    className="w-7 h-7 rounded-full object-cover"
                    />
                    <span className="font-medium text-gray-700">
                    {post.author.username}
                    </span>
                </Link>
                )}
            </div>
            </div>

          ))}
        </div>
      ) : (
        <p>No posts yet.</p>
      )}

      {/* Pagination */}
      <div className="flex justify-center gap-4 mt-12">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 rounded-full border bg-white shadow-sm disabled:opacity-50 hover:bg-gray-100"
        >
          ← Previous
        </button>
        <button
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 rounded-full border bg-white shadow-sm hover:bg-gray-100"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default Popular;
