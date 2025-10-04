import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { IUser } from "../services/user";
import { fetchGroupsByUserId, type Group } from "../services/group";
import {
  getMe,
  getUser,
} from "../services/user";

import { followUser, unfollowUser, getFollowersCount, getFollowingCount, isFollowing } from "../services/follow";
import type { Post } from "../services/post";
import { getPostByUser } from "../services/post";

export default function UserProfile() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<IUser | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const [groups, setGroups] = useState<Group[]>([]);

  // follow-related state
  const [followersCount, setFollowersCount] = useState<number>(0);
  const [followingCount, setFollowingCount] = useState<number>(0);
  const [isFollowingState, setIsFollowingState] = useState<boolean>(false);
  const [loadingFollow, setLoadingFollow] = useState<boolean>(false);

  // current logged-in user
  const [me, setMe] = useState<IUser | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // try to get current user (may fail if not logged in)
        let currentUser: IUser | null = null;
        try {
          currentUser = await getMe();
        } catch (err) {
          currentUser = null;
        }
        setMe(currentUser);

        // profile to show (if id given show that user, else show me)
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

        try{
          const groupsData = await fetchGroupsByUserId(profileUser._id);
          setGroups(groupsData);
        }catch(err: any){
          console.log("failed to fetch groups", err);
          setGroups([]);
        }

        // posts by that user
        const postData = await getPostByUser(profileUser._id);
        setPosts(postData);

        // load follower/following counts (parallel)
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

        // check if current user follows this profile (only relevant when viewing other's profile)
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
    if (!user) return <p className="text-center mt-10">User not found</p>;
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

        <div className="relative w-full h-56 md:h-64 rounded-2xl overflow-hidden shadow-lg">
        <img
          src={user.bannerUrl || "/default-banner.png"}
          alt="User banner"
          className="w-full h-full object-cover"
        />
        {/* đặt avatar đè lên banner luôn cho đẹp */}
        <div className="absolute -bottom-14 left-6">
          <img
            src={user.avatarUrl || "/default-avatar.png"}
            alt={user.username}
            className="w-28 h-28 rounded-full border-4 border-white shadow-lg object-cover"
          />
        </div>
      </div>
      {/* Top card */}
      <div className="bg-white shadow-lg rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left */}
        <div className="flex flex-col items-center md:items-start gap-3">
          <img
            src={user.avatarUrl || "/default-avatar.png"}
            alt={user.username}
            className="w-28 h-28 rounded-full border shadow"
          />
          <h2 className="text-2xl font-semibold">{user.username}</h2>
        </div>

        {/* Right */}
        <div className="flex flex-col gap-4">
          <p className="text-gray-700">{user.description || "No description yet."}</p>

          <div className="flex items-center gap-4">
            <div className="flex gap-6">
              <div className="text-center">
                <p className="text-lg font-bold">{followersCount}</p>
                <p className="text-sm text-gray-500">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold">{followingCount}</p>
                <p className="text-sm text-gray-500">Following</p>
              </div>
            </div>

            {/* Follow / Unfollow button (only shown when viewing another user and logged in) */}
            {me && me._id !== user._id && (
              <div className="ml-auto">
                {isFollowingState ? (
                  <button
                    onClick={handleUnfollow}
                    disabled={loadingFollow}
                    className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-xl"
                  >
                    {loadingFollow ? "..." : "Unfollow"}
                  </button>
                ) : (
                  <button
                    onClick={handleFollow}
                    disabled={loadingFollow}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl"
                  >
                    {loadingFollow ? "..." : "Follow"}
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-6 text-center md:text-left mt-4">
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

      {/* Edit button if viewing own profile */}
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
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4 text-blue-500">Groups</h3>
        {groups.length === 0 ? (
          <p className="text-gray-500">User is not in any group.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map((group) => (
              <div key={group._id} className="p-4 bg-white shadow rounded-xl hover:shadow-md transition cursor-pointer">
                <h4 className="font-semibold text-lg">{group.name}</h4>
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">{group.description || "No description"}</p>
                <p className="text-gray-500 text-sm mt-2">{group.memberCount} members</p>
              </div>
            ))}
          </div>
        )}
      </div>


      {/* Posts */}
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
