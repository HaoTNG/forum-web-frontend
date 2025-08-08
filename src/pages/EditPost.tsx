import React, {useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {getPostById, updatePost} from "../services/post.ts";

export default function EditPost(){
    const{id} = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        getPostById(id).then((res)=>{
            setTitle(res.data.title);
            setContent(res.data.content);
        })
    }, [id]);

    const handleSubmit = async (e: React.FormEvent)=>{
        e.preventDefault();
        try{
            await updatePost(id, {title, content});
            alert("Post updated successfully")
            navigate(`/post/${id}`);
        }catch(error){
            alert(`error updating post: ${error.message}`)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 flex flex-col gap 4">
            <h2 className="text-2xl font-bold">Edit Post</h2>
            <input
                className="border p-2"
                value={title}
                onChange={(e) => setTitle(e.target.value)}/>
            <textarea
                className="border p-2"
                value={content}
                onChange={(e) => setContent(e.target.value)}/>
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                Save Changes
            </button>
        </form>
    )
}