import { useEffect, useState } from "react";
import { getPostById, updatePost } from "../services/post";
import { useParams, useNavigate } from "react-router-dom";
import { TOPICS } from "../services/TOPICS.ts";

export default function EditPost() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [topic, setTopic] = useState("");

    useEffect(() => {
        if (!id) return;
        getPostById(id)
            .then((post) => {
                setTitle(post.title);
                setContent(post.content);
                setTopic(post.topic || "");
            })
            .catch(console.error);
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await updatePost(id!, { title, content, topic });
        navigate(`/post/${id}`);
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">
                ✏️ Edit Post
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                <div>
                    <label className="block font-medium text-gray-700 mb-1">Title</label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="block font-medium text-gray-700 mb-1">Content</label>
                    <textarea
                        className="w-full border border-gray-300 rounded-lg p-3 h-40 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="block font-medium text-gray-700 mb-1">Topic</label>
                    <select
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        required
                    >
                        <option value="">-- Select a Topic --</option>
                        {TOPICS.map((t) => (
                            <option key={t} value={t}>
                                {t.charAt(0).toUpperCase() + t.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>

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
    );
}
