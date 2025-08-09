import { useEffect, useState } from "react";
import { getPostById, updatePost } from "../services/post";
import { useParams, useNavigate } from "react-router-dom";

export default function EditPost() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");


    useEffect(() => {
        if (!id) return;
        getPostById(id)
            .then((post) => {
                setTitle(post.title);
                setContent(post.content);
            })
            .catch(console.error);
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await updatePost(id!, { title, content });
        navigate(`/post/${id}`);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto mt-10 flex flex-col gap-4"
        >
            <h2 className="text-2xl font-bold mb-4">Edit Post</h2>

            <label className="font-semibold">Title</label>
            <input
                className="border p-2 rounded"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <label className="font-semibold">Content</label>
            <textarea
                className="border p-2 rounded h-40 resize-none"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />

            <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
                Save Changes
            </button>
        </form>
    );
}
