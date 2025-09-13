import { useEffect, useState } from "react";
import { getPosts, getStats, getPopularPosts } from "../services/post.ts";
import { Link } from "react-router-dom";
import type {Post} from "../services/post.ts";
import {type Contributor, getTopContributors} from "../services/user.ts";
import ForumIndex from "./ForumIndex.tsx";
import MainCategories from "./MainCategories.tsx";
import UserInfoBox from "./UserInfoBox.tsx";
import heroImg from "../assets/wp.jpg";
const Home = () => {
    const [posts, setPosts] = useState<Post[]>([]);

const TopContributors = () => {
  const [contributors, setContributors] = useState<Contributor[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTopContributors();
        setContributors(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
        <ul className="space-y-2">
        {contributors.map((c, index) => (
            <li
            key={c._id}
            className="grid grid-cols-[1fr_auto_auto] items-center gap-4 p-2 border rounded hover:bg-[#29303d] transition "
            >
            
            <div className="flex items-center gap-1 min-w-0 text-gray-300">
                <span className="font-semibold">{index + 1}.</span>
                <Link
                to={`/user/${c._id}`}
                className="hover:underline truncate"
                title={c.username}
                >
                {c.username}
                </Link>
            </div>
            <span className="text-sm font-semibold text-right text-gray-300">{c.score}</span>
            
            <span className="text-gray-300 text-sm whitespace-nowrap">
                Contributions
            </span>

            
            </li>
        ))}
        </ul>




  );
};

const PopularArticles = () => {
  const [popular, setPopular] = useState<any[]>([]);

  useEffect(() => {
    getPopularPosts(6, 1) 
      .then((data) => setPopular(data.posts)) 
      .catch(console.error);
  }, []);

  // helper function
  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  return (
    <div>
      {popular.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {popular.map((post) => (
            <div
              key={post._id}
              className="p-4 rounded-lg shadow hover:shadow-md transition hover:bg-[#181d27] bg-gray-900 flex flex-col justify-between h-[200px] text-white"
            >
              {/* Title + Content */}
              <div>
                <h3 className="font-bold text-lg  mb-2 break-words">
                  <Link
                    to={`/post/${post._id}`}
                    className="text-xl font-semibold hover:underline break-words"
                  >
                    {truncateText(post.title, 60)}
                  </Link>
                </h3>
                <p className="text-gray-400 break-words line-clamp-3">
                  {truncateText(post.content, 300)}
                </p>
              </div>


              {/* Footer: likes, date, author */}
              <div className="flex justify-between items-center text-sm  mt-3">
                <div>
                  <span>👍 {post.likes.length} likes</span>
                  <span className="ml-3">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {post.author && (
                  <Link
                    to={`/user/${post.author._id}`}
                    className="flex items-center gap-2 hover:underline"
                  >
                    <img
                      src={post.author.avatarUrl || "/default-avatar.png"}
                      alt={post.author.username}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <span className="font-medium ">
                      {post.author.username}
                    </span>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No popular articles yet.</p>
      )}

      <div className="mt-6 text-center">
        <Link
          to="/popular"
          className="inline-block px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow transition"
        >
          See more →
        </Link>
      </div>
    </div>
  );
};


const  StatsBox = () => {
  const [stats, setStats] = useState<{threads: number, messages: number, members: number} | null>(null);

  useEffect(() => {
    getStats().then(data => setStats(data));
  }, []);

  if (!stats) return <div>Loading stats...</div>;

  return (
    <div className="mt-6 p-4 border rounded shadow-sm bg-[#1d2129]">
      <h2 className="text-lg font-semibold mb-3 text-blue-500">Forum statistics</h2>
      <ul className="grid gap-2 text-sm text-gray-200">
        <li className="grid grid-cols-[1fr_auto]">
          <span>Threads</span>
          <span className="font-medium">{stats.threads.toLocaleString()}</span>
        </li>
        <li className="grid grid-cols-[1fr_auto]">
          <span>Messages</span>
          <span className="font-medium">{stats.messages.toLocaleString()}</span>
        </li>
        <li className="grid grid-cols-[1fr_auto]">
          <span>Members</span>
          <span className="font-medium">{stats.members.toLocaleString()}</span>
        </li>
      </ul>
    </div>
  );
}

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
                  src={heroImg}
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
                            className="flex items-center justify-center bg-transparent border-3 text-4xl border-black text-black font-bold px-4 py-2 rounded-2xl w-[400px] h-[100px] hover:bg-[#336bb0] hover:text-white hover:border-[#336bb0] transition mb-[24px] "
                        >
                            Create Thread
                        </Link>
                        <Link
                            to="/trending"
                            className="flex items-center justify-center bg-transparent border-3 text-4xl border-black text-black font-bold px-4 py-2 rounded-2xl w-[400px] h-[100px] hover:bg-[#336bb0] hover:text-white hover:[#336bb0] transition "
                        >
                            Trending Contents
                        </Link>
                    </div>

                </div>

            </div>

            <section className="max-w-[1500px] mx-auto mt-8 px-7 grid grid-cols-12 gap-4 bg-">
                <div className="col-span-9 space-y-6">
                  <div className="mx-auto  bg-[#1d2129] p-6 rounded-lg shadow">
                    <h1 className="text-2xl font-bold mb-6 text-blue-500">Main Categories</h1>
                    <MainCategories />
                  </div>
                  
                  <div className=" mx-auto  bg-[#1d2129] p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4 text-blue-500">Hot Topics</h2>
                    <ForumIndex />
                  </div>

                    
                </div>

                {/* Right Column (20%) */}
                <div className="col-span-3 space-y-6 ">
                    <div className="bg-[#1d2129] p-6 rounded-lg shadow ">
                        <h2 className="text-xl font-semibold mb-4 text-blue-500">Top Contributors</h2>
                        <TopContributors />
                    </div>

                    
                    <StatsBox />
                    <UserInfoBox/>

                  <div className="bg-[#1d2129] p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-3 text-yellow-400"> Announcement</h2>
                    <p className="text-gray-200 text-sm leading-relaxed">
                      For now, this forum does not apply strict content moderation. You are free to post, comment, 
                      and discuss openly. However, moderators and administrators may still remove content that 
                      violates community guidelines, and users may be banned for repeated or serious offenses.  
                      Please engage respectfully and contribute to a positive, welcoming environment.
                    </p>
                  </div>

                </div>

            </section>
            
            
            <div className=" p-6 rounded-lg shadow max-w-[1450px] mx-auto mt-20 bg-[#1d2129]">
                <h2 className="text-xl font-semibold mb-4 text-blue-500">Popular Articles</h2>
                <PopularArticles/>
            </div>
            
            <div className="bg-[#1d2129] p-6 rounded-lg shadow max-w-[1450px] mx-auto mt-20">
              <h2 className="text-2xl font-bold mb-4 text-blue-500">Latest Posts</h2>
              <div className="mt-8">
                <div className="space-y-0 divide-y divide-gray-700">
                  {posts.slice(0, 10).map((post, index) => (
                    <div
                      key={post._id}
                      className={`p-4 shadow hover:shadow-md transition-shadow flex justify-between items-center hover:bg-[#22262e] text-white bg-gray-900
                        ${index === 0 ? "rounded-t-xl" : " "}
                        ${index === posts.slice(0, 10).length - 1 ? "rounded-b-xl" : ""}`}
                    >
                      {/* Cột trái: Title + Content */}
                      <div className="flex-1 pr-4">
                        <Link to={`/post/${post._id}`} className="text-xl font-semibold hover:underline">
                          {post.title.substring(0, 50)}
                        </Link>
                        <p className="text-gray-400">{post.content.substring(0, 70)}...</p>
                      </div>

                      {/* Cột giữa: Comments + Likes */}
                      <div className="grid grid-cols-2 gap-x-2 px-4">
                        <span className="text-sm text-gray-300">Comments:</span>
                        <span className="text-sm text-gray-300">{post.commentsCount || 0}</span>

                        <span className="text-sm text-gray-300">Likes:</span>
                        <span className="text-sm text-gray-300">{post.likesCount || 0}</span>
                      </div>

                      {/* Cột phải: Avatar + Author + Time */}
                      <div className="flex flex-col items-end text-sm text-gray-400">
                        {post.author ? (
                          <Link to={`/user/${post.author._id}`} className="flex items-center gap-2 hover:underline text-gray-200">
                            <img
                              src={post.author.avatarUrl || "/default-avatar.png"}
                              alt="avatar"
                              className="w-6 h-6 rounded-full"
                            />
                            {post.author.username}
                          </Link>
                        ) : (
                          <span>Deleted account</span>
                        )}
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

        </div>
    );
};

export default Home;
