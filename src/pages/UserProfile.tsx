import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { IUser } from "../services/user";
import { getMe, getUser } from "../services/user";
import  type {Post} from "../services/post"; 
import { getPostByUser } from "../services/post"; 

export default function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState<IUser | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let data: IUser;

        if (id) {
          data = await getUser(id);
          
        } else {
          data = await getMe();
        }

        setUser(data);

        
        const postData = await getPostByUser(data._id);
        setPosts(postData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!user) return <p className="text-center mt-10">User not found</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      {/* Hàng trên */}
      <div className="bg-white shadow-lg rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bên trái */}
        <div className="flex flex-col items-center md:items-start gap-3">
          <img
            src={user.avatarUrl || "/default-avatar.png"}
            alt={user.username}
            className="w-28 h-28 rounded-full border shadow"
          />
          <h2 className="text-2xl font-semibold">{user.username}</h2>
        </div>

        {/* Bên phải */}
        <div className="flex flex-col gap-4">
          <p className="text-gray-700">{user.description || "No description yet."}</p>

          <div className="grid grid-cols-3 gap-6 text-center md:text-left">
            <div>
              <p className="text-lg font-bold">{user.posts.length}</p>
              <p className="text-sm text-gray-500">Posts</p>
            </div>
            <div>
              <p className="text-lg font-bold">{user.comments.length}</p>
              <p className="text-sm text-gray-500">Comments</p>
            </div>
            <div>
              <p className="text-lg font-bold">{user.score}</p>
              <p className="text-sm text-gray-500">Score</p>
            </div>
          </div>
        </div>
      </div>

      {/* Nút Edit (chỉ mình mới thấy) */}
      {!id && (
        <div className="text-right mt-4">
          <button
            onClick={() => navigate("/user/me/edit")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl transition"
          >
            Edit Profile
          </button>
        </div>
      )}

      {/* Hàng dưới - Posts */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4 text-blue-500">Posts</h3>
        {posts.length === 0 ? (
          <p className="text-gray-500">No posts yet.</p>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post._id}
                className="p-4 bg-white shadow rounded-xl hover:shadow-md transition cursor-pointer"
                onClick={() => navigate(`/post/${post._id}`)}
              >
                <h4 className="font-semibold text-lg line-clamp-1 break-words">{post.title}</h4>
                <p className="text-gray-600 text-sm mt-1 line-clamp-2 break-words">{post.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
