import React, {useState} from 'react';
import {createPost} from "../services/post.ts";
import {useNavigate} from "react-router-dom";

export default function  CreatePost() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const navigate = useNavigate();
    const handleSubmit = async (e: React.FormEvent)=>{
        e.preventDefault();
        try{
            const author = localStorage.getItem('username');
            const response = await createPost({title,content, author});
            navigate(`/post/${response.data._id}`)
        }catch(error){
            console.log(error);
            alert("failed to create post")
        }
    }

    return (
        <div className="max-w-md mx-auto mt-10">
            <h2 className="text-2xl font-bold mb-4">Create New Post</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    className="border p-2"
                    text="text"
                    placeholder="title"
                    value={title}
                    onChange={(e)=>setTitle(e.target.value)}
                />
                <textarea
                className="border p-2"
                placeholder="content"
                value={content}
                onChange={(e)=>setContent(e.target.value)}
                />

                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-800"
                        type="submit">
                    Create Post
                </button>


            </form>
        </div>
    )
}