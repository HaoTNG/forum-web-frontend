import { useEffect, useState } from "react";
import { getPosts, getStats} from "../services/post.ts";
import { Link } from "react-router-dom";
import type {Post} from "../services/post.ts";
import {type Contributor, getTopContributors} from "../services/user.ts";
import ForumIndex from "./ForumIndex.tsx";
import MainCategories from "./MainCategories.tsx";
import UserInfoBox from "./UserInfoBox.tsx";
import PostCard from "../components/PostCard.tsx";
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
                  <div className="bg-[#1d2129] p-6 rounded-lg shadow max-w-[1450px] mx-auto mt-20">
              <h2 className="text-2xl font-bold mb-4 text-blue-500">NewsFeed</h2>
              <div className="mt-8">
                {posts.slice(0, 10).map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
            </div>
                    
                </div>

                {/* Right Column (20%) */}
                <div className="col-span-3 space-y-6 relative">
                  
                    <div className="bg-[#1d2129] p-6 rounded-lg shadow ">
                        <h2 className="text-xl font-semibold mb-4 text-blue-500">Top Contributors</h2>
                        <TopContributors />
                    </div>

                    
                    
                  <div className="bg-[#1d2129] p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-3 text-yellow-400"> Announcement</h2>
                    <p className="text-gray-200 text-sm leading-relaxed">
                      For now, this forum does not apply strict content moderation. You are free to post, comment, 
                      and discuss openly. However, moderators and administrators may still remove content that 
                      violates community guidelines, and users may be banned for repeated or serious offenses.  
                      Please engage respectfully and contribute to a positive, welcoming environment.
                    </p>
                  </div>
                    <StatsBox />
                    <div className="sticky top-20 space-y-6">
                      <UserInfoBox/>
                    </div>
                </div>

            </section>
            
            
           
            



        </div>
    );
};

export default Home;
