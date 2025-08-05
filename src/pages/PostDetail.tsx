import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPostById } from "../services/post";

export interface Post {
    _id: string;
    title: string;
    content: string;
    author: {
        username: string;
    };
}

const PostDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState<Post | null>(null);

    useEffect(() => {
        const fetchPost = async () => {
            if(id){
                const data = await getPostById(id);
                setPost(data);
            }
        };
        fetchPost();
    }, [id])

    if(!post){
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto mt-6">
            <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
            <p className="text-gray-700 mb-4">By {post.author}</p>
            <p>{post.content}</p>
        </div>
    )
}

export default PostDetail;