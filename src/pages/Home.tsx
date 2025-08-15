import { useEffect, useState } from "react";
import { getPosts } from "../services/post.ts";
import { Link } from "react-router-dom";

interface Post {
    _id: string;
    title: string;
    content: string;
    author: {
        _id: string;
        username: string;
    };
}

const Home = () => {
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getPosts();
            setPosts(data);
        };

        fetchData();
    }, []);

    return (
        <div >

            <div className="relative w-full h-[550px] ">

                <img
                    src="src/assets/wp.jpg"
                    alt="Hero"
                    className="w-full h-full object-cover"
                />


                <div className="absolute inset-0 bg-black/50 flex items-center justify-evenly gap-x-8 text-white p-8">
                    {/* Left column */}
                    <div className="max-w-2xl space-y-4">
                        <h1 className="text-6xl font-bold">Welcome to Zforum</h1>
                        <p>A place to share your ideas, discover trending news, and connect with people worldwide.</p>
                        <p>Post your thoughts, explore fresh perspectives, and join meaningful conversations.</p>
                        <p>Our community thrives on creativity, respect, and open dialogue.</p>
                        <p>Start engaging today and be part of something inspiring.</p>
                    </div>

                    {/* Right column */}
                    <div className="flex flex-col gap-4">
                        <Link
                            to="/create"
                            className="flex items-center justify-center bg-transparent border-2 text-4xl border-black text-black font-bold px-4 py-2 rounded w-[350px] h-[80px] hover:bg-[#336bb0] hover:text-white hover:border-[#336bb0] transition mb-[24px] "
                        >
                            Create Thread
                        </Link>
                        <Link
                            to="/trending"
                            className="flex items-center justify-center bg-transparent border-2 text-4xl border-black text-black font-bold px-4 py-2 rounded w-[350px] h-[80px] hover:bg-[#336bb0] hover:text-white hover:[#336bb0] transition "
                        >
                            Trending Contents
                        </Link>
                    </div>

                </div>

            </div>

            <section className="max-w-[1500px] mx-auto mt-8 px-7 grid grid-cols-10 gap-4 bg-">


                <div className="col-span-8 space-y-6">

                    <div className="bg-[#1d2129] p-6 rounded-lg shadow">
                        <h2 className="text-2xl font-bold mb-4 text-white">Latest Posts</h2>
                        <div className="mt-8">
                            <div className="space-y-4">
                                {posts.map((post) => (
                                    <div
                                        key={post._id}
                                        className="p-4  rounded-2xl shadow hover:shadow-md transition-shadow flex justify-between items-center text-white bg-gray-900 mb-3"
                                    >

                                        <div className="flex-1 pr-4">
                                            <Link to={`/post/${post._id}`} className="text-xl font-semibold hover:underline">
                                                    {post.title}
                                            </Link>
                                            <p className="text-gray-400">{post.content.substring(0, 100)}...</p>
                                        </div>


                                        {/* Cột giữa: Comments + Likes */}
                                        <div className="grid grid-cols-2 gap-x-2 px-4">
                                            <span className="text-sm text-gray-300">Comments:</span>
                                            <span className="text-sm text-gray-300">{post.comments.length || 0}</span>

                                            <span className="text-sm text-gray-300">Likes:</span>
                                            <span className="text-sm text-gray-300">{post.likes.length || 0}</span>
                                        </div>


                                        {/* Cột phải: Author + Time */}
                                        <div className="flex flex-col items-end text-sm text-gray-400">
                                            <span>{post.author ? post.author.username : "Deleted account"}</span>
                                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Another section */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4">Popular Articles</h2>
                        {/* Popular list here */}
                    </div>
                </div>

                {/* Right Column (20%) */}
                <div className="col-span-2 space-y-6">
                    {/* Top Contributors */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4">Top Contributors</h2>
                        {/* List users here */}
                    </div>

                    {/* Some stats */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4">Stats</h2>
                        {/* Numbers here */}
                    </div>
                </div>
            </section>




        </div>
    );
};

export default Home;
