// src/components/PostCard.tsx
import { Link } from "react-router-dom";
import type { Post } from "../services/post";
import { likePost, dislikePost } from "../services/post";
import { useState } from "react";
import { ThumbsUp, ThumbsDown, MessageSquareText } from "lucide-react";

const PostCard = ({ post }: { post: Post }) => {
  const localPost = post;

  const [likesCount, setLikesCount] = useState(localPost.likesCount || 0);
  const [dislikesCount, setDislikesCount] = useState(localPost.dislikesCount || 0);  
  const commentsCount = localPost.commentsCount || 0;
    const handleLike = async () => {
      if (!post) return;
      const res = await likePost(post._id);
      setLikesCount(res.likes);
      setDislikesCount(res.dislikes);
    };
    const handleDislike = async () => {
      if (!post) return;
      const res = await dislikePost(post._id);
      setLikesCount(res.likes);
      setDislikesCount(res.dislikes);
    };
  // Safety defaults
  const author = localPost.author ?? { _id: "", username: "Deleted account", avatarUrl: "/default-avatar.png" };
  const images = localPost.images ?? [];

  return (
    <div className="bg-gray-900 p-6 rounded-2xl shadow-md border border-gray-800 mb-6 hover:bg-gray-850 transition-colors">
      
      {/* Author */}
      <Link to={author._id ? `/user/${author._id}` : "#"} className="inline-flex items-center gap-2 hover:underline">
        <img
          src={author.avatarUrl || "/default-avatar.png"}
          alt={author.username}
          className="w-9 h-9 rounded-full object-cover border border-gray-700"
        />
        <div className="flex flex-col">
          <span className="font-medium text-gray-200">{author.username}</span>
          <span className="text-xs text-gray-500">{new Date(localPost.createdAt).toLocaleString()}</span>
        </div>
      </Link>

      {/* Content */}
      <div className="mt-3">
        <Link to={`/post/${localPost._id}`}>
          <h2 className="text-xl font-bold text-gray-100 hover:text-blue-400 transition-colors">
            {localPost.title ?? "Untitled"}
          </h2>
        </Link>
        <p className="mt-2 text-gray-300 whitespace-pre-line break-words leading-relaxed">
          {localPost.content ?? ""}
        </p>
      </div>

      {/* Images */}
      {images.length > 0 && (
        <div className="mt-3 flex flex-col gap-3">
          {images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`post-${i}`}
              onClick={() => window.open(`/post/${localPost._id}`, "_blank")}
              className="rounded-xl shadow-sm object-contain max-h-[600px]"
            />
          ))}
        </div>
      )}

      {/* Like / Dislike */}
      <div className="mt-4 flex items-center gap-4 text-gray-300 text-[15px]">
        <button
          onClick={handleLike}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-700 transition-colors"
        >
          <ThumbsUp /> Like <span>{likesCount}</span>
        </button>
        <button
          onClick={handleDislike}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-700 transition-colors"
        >
          <ThumbsDown /> Dislike <span>{dislikesCount}</span>
        </button>

        <button
          onClick={() => window.open(`/post/${localPost._id}`, "_blank")}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-700 transition-colors"
        >
          <MessageSquareText /> Comments <span>{commentsCount}</span>
        </button>
      </div>
    </div>
  );
};

// Helper tạm: reload lại bài viết sau khi like/dislike


export default PostCard;
