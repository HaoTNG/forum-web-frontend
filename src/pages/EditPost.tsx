import React, { useEffect, useState } from "react";
import { getPostById, updatePost } from "../services/post.ts";
import { useParams, useNavigate } from "react-router-dom";
import { TOPICS } from "../services/TOPICS.ts";

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [topic, setTopic] = useState(TOPICS[0]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getPostById(id)
      .then((post) => {
        setTitle(post.title);
        setContent(post.content);
        setTopic(post.topic || TOPICS[0]);
        setExistingImages(post.images || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updatePost(id!, {
        title,
        content,
        topic,
        images: newImages.length > 0 ? newImages : undefined, 
      });
      navigate(`/post/${id}`);
    } catch (error) {
      console.error(error);
      alert("Failed to update post");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto mt-12">
      <div className="bg-white shadow-lg rounded-2xl p-8 border">
        <h2 className="text-3xl font-semibold mb-8 text-center text-gray-800">
          ✏️ Edit Post
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

          {/* Existing Images */}
          {existingImages.length > 0 && newImages.length === 0 && (
            <div>
              <p className="text-sm text-gray-600 mb-2">Current Images:</p>
              <div className="flex gap-3 flex-wrap">
                {existingImages.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt="existing"
                    className="w-28 h-28 object-cover rounded-xl border shadow-sm"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Upload New Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload New Images (optional)
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          {/* Preview New Images */}
          {newImages.length > 0 && (
            <div className="flex gap-3 flex-wrap">
              {newImages.map((img, idx) => (
                <img
                  key={idx}
                  src={URL.createObjectURL(img)}
                  alt="new preview"
                  className="w-28 h-28 object-cover rounded-xl border shadow-sm"
                />
              ))}
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="px-5 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800"
              onClick={() => navigate(`/post/${id}`)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white"
            >
              💾 Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
