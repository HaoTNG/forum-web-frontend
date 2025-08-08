import {useEffect, useState} from "react";
import {getPosts} from "../services/post.ts";
import{Link} from "react-router-dom";

interface Post {
    _id: string;
    title: string;
    content: string;
    author: {
        _id: string;
        username: string};
}
const Home = () => {
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(()=>{
        const fetchData = async () =>{
            const data = await getPosts();
            setPosts(data);
        };

        fetchData();
    }, []);

    return (
        <div>
            <div>
                <Link to="/create"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-900"
                >Create Post</Link>
            </div>
            <h2 className="text-2xl font-bold mb-4">Latest Posts</h2>
            <div className="space-y-4 justify-between">
                {posts.map((post)=>(
                    <div key={post._id} className="p-4 border rounded shadow">
                        <h3 className="text-xl font-semibold">{post.title}</h3>
                        <p className="text-gray-600">{post.content.substring(0,100)}</p>
                        <p className="text-sm text-gray-400">
                            By {post.author.username}
                        </p>
                        <Link
                        to={`/post/${post._id}`}>
                            Read more
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Home;