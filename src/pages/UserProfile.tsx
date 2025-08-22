import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type {IUser} from "../services/user";

export default function UserProfile() {
  const { id } = useParams(); 
  const navigate = useNavigate();


  const currentUserId = "123"; 

  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/users/${id}`);
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, [id]);

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="flex justify-center mt-10">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center gap-6">
        
       
        <div className="flex flex-col items-center gap-3">
          <img
            src={user.avatarUrl || "/default-avatar.png"}
            alt={user.username}
            className="w-28 h-28 rounded-full border shadow"
          />
          <h2 className="text-2xl font-semibold">{user.username}</h2>
        </div>

        
        <div className="grid grid-cols-3 gap-6 text-center">
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

        
        <div className="w-full text-center">
          <p className="text-gray-700">
            {user.description || "No description yet."}
          </p>
        </div>

        
        {currentUserId === user._id && (
          <button
            onClick={() => navigate("/profile")}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl transition"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
}
