import React, { useState } from "react";
import { createPost } from "../services/post.ts";
import { useNavigate } from "react-router-dom";
import { TOPICS } from "../services/TOPICS.ts";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [topic, setTopic] = useState(TOPICS[0]);
  const [images, setImages] = useState<File[]>([]);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await createPost({
        title,
        content,
        topic,
        images,
      });
      navigate(`/post/${response.data._id}`);
    } catch (error) {
      console.error(error);
      alert("Failed to create post");
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-12">
      <div className="bg-white shadow-lg rounded-2xl p-8 border">
        <h2 className="text-3xl font-semibold mb-8 text-center text-gray-800">
          Create New Post
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              type="text"
              placeholder="Enter a catchy title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              className="w-full border rounded-lg px-3 py-2 h-32 resize-none focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Write your post content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          {/* Topic */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Topic
            </label>
            <select
              className="w-full border rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            >
              {TOPICS.map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Images
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          {/* Image preview */}
          {images.length > 0 && (
            <div className="flex gap-3 flex-wrap">
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={URL.createObjectURL(img)}
                  alt="preview"
                  className="w-28 h-28 object-cover rounded-xl border shadow-sm"
                />
              ))}
            </div>
          )}

          {/* Submit button */}
          <button
            className="bg-blue-600 text-white py-2.5 rounded-xl font-medium hover:bg-blue-700 active:scale-95 transition-transform shadow-md"
            type="submit"
          >
             Create Post
          </button>
        </form>
      </div>
    </div>
  );
}
