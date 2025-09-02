import { useEffect, useState } from "react";
import { getFixedTopicStats } from "../services/post";
import { useNavigate } from "react-router-dom";

type TopicStat = {
  topic: string;
  threads: number;
  messages: number;
};

export default function MainCategories() {
  const [categories, setCategories] = useState<TopicStat[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getFixedTopicStats();
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch topics", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="rounded-xl shadow-lg overflow-hidden">
      {categories.map((cat) => (
        <div
          key={cat.topic}
          className="border-b text-blue-300 bg-[#1f2530] p-4 grid grid-cols-[1fr_auto] items-center cursor-pointer hover:bg-[#2a2f3a] transition"
        >
          
          <div>
            <span className="text-lg font-semibold hover:underline cursor-pointer" onClick={()=>navigate(`topics/${cat.topic}`)}>
              {cat.topic}
            </span>
          </div>

          
          <div className="text-sm text-gray-400 grid grid-cols-[auto_auto] gap-x-2 gap-y-1 justify-center">
            <span>Threads:</span>
            <span className="tabular-nums">{cat.threads}</span>

            <span>Messages:</span>
            <span className="tabular-nums">{cat.messages}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
