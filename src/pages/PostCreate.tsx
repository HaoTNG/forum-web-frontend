import React, { useState } from "react";
import { createPost } from "../services/post.ts";
import { useNavigate } from "react-router-dom";
import {TOPICS} from "../services/TOPICS.ts";


 // import list topic

export default function CreatePost() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [topic, setTopic] = useState(TOPICS[0]);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await createPost({ title, content, topic });
            navigate(`/post/${response.data._id}`);
        } catch (error) {
            console.error(error);
            alert("Failed to create post");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <h2 className="text-2xl font-bold mb-4">Create New Post</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    className="border p-2"
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <textarea
                    className="border p-2"
                    placeholder="Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />
                <select
                    className="border p-2"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                >
                    {TOPICS.map((t) => (
                        <option key={t} value={t}>
                            {t.charAt(0).toUpperCase() + t.slice(1)}
                        </option>
                    ))}
                </select>

                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-800"
                    type="submit"
                >
                    Create Post
                </button>
            </form>
        </div>
    );
}
