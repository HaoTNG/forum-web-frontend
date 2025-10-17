import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { IUser } from "../services/user";
import { getMe, getUser } from "../services/user";
import {
  followUser,
  unfollowUser,
  getFollowersCount,
  getFollowingCount,
  isFollowing,
} from "../services/follow";
import type { Post } from "../services/post";
import { getPostByUser } from "../services/post";
import PostCard from "../components/PostCard";
export default function UserProfile() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<IUser | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowingState, setIsFollowingState] = useState(false);
  const [loadingFollow, setLoadingFollow] = useState(false);

  const [me, setMe] = useState<IUser | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // current user
        let currentUser: IUser | null = null;
        try {
          currentUser = await getMe();
        } catch {
          currentUser = null;
        }
        setMe(currentUser);

        // target user
        let profileUser: IUser;
        if (id) {
          profileUser = await getUser(id);
        } else {
          if (!currentUser) {
            navigate("/login");
            return;
          }
          profileUser = currentUser;
        }
        setUser(profileUser);

        

        // posts
        const postData = await getPostByUser(profileUser._id);
        setPosts(postData);

        // follow stats
        const [followersRes, followingRes] = await Promise.allSettled([
          getFollowersCount(profileUser._id),
          getFollowingCount(profileUser._id),
        ]);

        if (followersRes.status === "fulfilled") {
          setFollowersCount(followersRes.value.followersCount ?? 0);
        }
        if (followingRes.status === "fulfilled") {
          setFollowingCount(followingRes.value.followingCount ?? 0);
        }

        // check following
        if (currentUser && currentUser._id !== profileUser._id) {
          try {
            const status = await isFollowing(profileUser._id);
            setIsFollowingState(!!status.isFollowing);
          } catch {
            setIsFollowingState(false);
          }
        } else {
          setIsFollowingState(false);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleFollow = async () => {
    if (!me) {
      navigate("/login");
      return;
    }
    if (!user) return;
    setLoadingFollow(true);
    try {
      await followUser(user._id);
      setIsFollowingState(true);
      setFollowersCount((v) => v + 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingFollow(false);
    }
  };

  const handleUnfollow = async () => {
    if (!me) {
      navigate("/login");
      return;
    }
    if (!user) return;
    setLoadingFollow(true);
    try {
      await unfollowUser(user._id);
      setIsFollowingState(false);
      setFollowersCount((v) => Math.max(0, v - 1));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingFollow(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!user) return <p className="text-center mt-10">User not found</p>;

  return (
  <div className="max-w-4xl mx-auto mt-10 px-4">
  {/* === Banner + Avatar + Info === */}
  <div className="relative">
    {/* Banner */}
    <div className="w-full h-56 md:h-64 rounded-t-2xl overflow-hidden shadow-lg">
      <img
        src={user.bannerUrl || "/default-banner.png"}
        alt="User banner"
        className="w-full h-full object-cover"
      />
    </div>

    {/* Info Box */}
    <div className="bg-gray-900 shadow-lg rounded-b-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left */}
      <div className="flex flex-col items-center md:items-start gap-3 pt-16 md:pt-0">
        <h2 className="text-2xl font-semibold mt-20 text-gray-200 ml-10">{user.username}</h2>
      </div>

      {/* Right */}
      <div className="flex flex-col gap-4">
        <p className="text-gray-300">{user.description || "No description yet."}</p>

        <div className="flex items-center gap-4">
          <div className="flex gap-6">
            <div className="text-center">
              <p className="text-lg font-bold text-gray-300">{followersCount} Followers</p>
              
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-gray-300">{followingCount} Following</p>
              
            </div>
          </div>

          {/* Follow / Unfollow button */}
          {me && me._id !== user._id && (
            <div className="ml-auto">
              {isFollowingState ? (
                <button
                  onClick={handleUnfollow}
                  disabled={loadingFollow}
                  className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-xl transition"
                >
                  {loadingFollow ? "..." : "Unfollow"}
                </button>
              ) : (
                <button
                  onClick={handleFollow}
                  disabled={loadingFollow}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl transition"
                >
                  {loadingFollow ? "..." : "Follow"}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Posts / Comments / Score */}
        <div className="grid grid-cols-3 gap-6 text-center md:text-left mt-4">
          <div>
            <p className="text-lg font-bold text-gray-400">{user.posts?.length ?? 0}</p>
            <p className="text-sm text-gray-500">Posts</p>
          </div>
          <div>
            <p className="text-lg font-bold text-gray-400">{user.comments?.length ?? 0}</p>
            <p className="text-sm text-gray-500">Comments</p>
          </div>
          <div>
            <p className="text-lg font-bold text-gray-400">{user.score ?? 0}</p>
            <p className="text-sm text-gray-500">Score</p>
          </div>
        </div>
      </div>
    </div>

    {/* Avatar (centered & overlay) */}
    <div className="absolute left-1/10 transform -translate-x-1/2 top-45 z-20">
      <img
        src={user.avatarUrl || "/default-avatar.png"}
        alt={user.username}
        className="w-36 h-36 rounded-full border-4 border-white shadow-lg object-cover transition-transform duration-200 "
      />
    </div>
  </div>

      {/* Edit button */}
      {me && user && me._id === user._id && (
        <div className="text-right mt-4">
          <button
            onClick={() => navigate("/user/me/edit")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl transition"
          >
            Edit Profile
          </button>
        </div>
      )}



      {/* === Posts === */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4 text-blue-500">Posts</h3>
        {posts.length === 0 ? (
          <p className="text-gray-500">No posts yet.</p>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div>
                <PostCard key={post._id} post={post} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
