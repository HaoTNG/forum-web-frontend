import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMe } from "../services/user.ts"; // giả sử bạn có hàm này
import type { IUser } from "../services/user.ts";
import { useNavigate } from "react-router-dom";
import { getFollowersCount, getFollowingCount} from "../services/follow";
const UserInfoBox = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [followersCount, setFollowersCount] = useState<number>(0);
  const [followingCount, setFollowingCount] = useState<number>(0);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getMe();
        setUser(data);
        const [followersRes, followingRes] = await Promise.allSettled([
          getFollowersCount(data._id),
          getFollowingCount(data._id),
        ]);
        if (followersRes.status === "fulfilled") {
          setFollowersCount(followersRes.value.followersCount ?? 0);
        }
        if (followingRes.status === "fulfilled") {
          setFollowingCount(followingRes.value.followingCount ?? 0);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);

  if (!user) return <div className="text-gray-400">Loading user info...</div>;

  return (
    <div className="p-4 border rounded shadow-sm bg-[#1d2129]">
      <h2 className="text-lg font-semibold mb-3 text-blue-500">User Info</h2>

      <div className="flex items-center gap-3 mb-4">
        <img
          src={user.avatarUrl || "/default-avatar.png"}
          alt={user.username}
          className="w-12 h-12 rounded-full object-cover cursor-pointer"
          onClick={()=>navigate(`/user/${user._id}`)}
        />
        <Link
          to={`/user/${user._id}`}
          className="text-lg font-medium text-gray-200 hover:underline"
        >
          {user.username}
        </Link>
      </div>

      <ul className="grid gap-2 text-sm text-gray-200">
        <li className="grid grid-cols-[1fr_auto]">
          <span>Followers</span>
          <span className="font-medium">{followersCount}</span>
        </li>
        <li className="grid grid-cols-[1fr_auto]">
          <span>Following</span>
          <span className="font-medium">{followingCount}</span>
        </li>
        <li className="grid grid-cols-[1fr_auto]">
          <span>Posts</span>
          <span className="font-medium">{user.posts.length}</span>
        </li>
        <li className="grid grid-cols-[1fr_auto]">
          <span>Comments</span>
          <span className="font-medium">{user.comments.length}</span>
        </li>
        
      </ul>
    </div>
  );
};

export default UserInfoBox;
