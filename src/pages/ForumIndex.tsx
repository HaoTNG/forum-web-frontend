import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTopicStats } from "../services/post";

type LatestPost = {
  title: string;
  id: string;
  author: {
    username: string;
    avatarUrl?: string;
    id: string;
  };
  createdAt: string;
};

type TopicStat = {
  topic: string;
  threads: number;
  messages: number;
  latestPost?: LatestPost;
};

const ForumIndex: React.FC = () => {
  const [topics, setTopics] = useState<TopicStat[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getTopicStats()
      .then(data => setTopics(data))
      .catch(err => console.error(err));
  }, []);

  return (
  <div className="rounded-xl bg-[#1f2530] shadow-lg overflow-hidden">
    {topics.map((t, i) => (
      <div
        key={i}
        className="border-b border-gray-700 p-4 grid grid-cols-10 items-center hover:bg-[#2a2f3a] transition"
      >
        {/* Left: Topic name (2/10) */}
        <div className="col-span-2 text-left">
          <span
            className="text-lg font-semibold cursor-pointer hover:underline text-blue-300"
            onClick={() => navigate(`/topics/${t.topic}`)}
          >
            {t.topic}
          </span>
        </div>

        {/* Middle: Stats (2/10) */}
        <div className="col-span-2 text-sm text-gray-400 grid grid-cols-[auto_auto] gap-x-2 gap-y-1">
          <span>Threads:</span>
          <span className="tabular-nums">{t.threads}</span>

          <span>Messages:</span>
          <span className="tabular-nums">{t.messages}</span>
        </div>

        {/* Right: Latest post (6/10) */}
        {t.latestPost && (
        <div className="col-span-6 flex items-center gap-3 justify-end">
            <img
            src={t.latestPost.author.avatarUrl || "/default-avatar.png"}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover flex-shrink-0 cursor-pointer"
            onClick={()=>navigate(`user/${t.latestPost?.author.id}`)}
            />
            <div className="flex flex-col w-[300px]">
              <span className="text-sm font-medium text-gray-200 truncate hover:underline cursor-pointer" onClick={()=>navigate(`post/${t.latestPost?.id}`)}>
                  {t.latestPost.title}
              </span>
              <span className="text-xs text-gray-400 truncate">
                by {" "}
                  <span className="hover:underline cursor-pointer" onClick={()=>navigate(`user/${t.latestPost?.author.id}`)}>
                    {t.latestPost.author.username}
                  </span>
                  {" "}•{" "}
                  {new Date(t.latestPost.createdAt).toLocaleDateString()}
              </span>
            </div>
        </div>
        )}

      </div>
    ))}
  </div>
);




};

export default ForumIndex;
