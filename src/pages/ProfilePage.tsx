import { useEffect, useState } from "react";
import {
  getMe,
  updateMe,
  deleteMe,
  uploadAvatar,
  uploadBanner,
  checkUsernameAvailable,
} from "../services/user.ts";
import type { IUser } from "../services/user.ts";
import { logoutUser } from "../services/auth";
import { useNavigate } from "react-router-dom";
export default function ProfilePage() {
  const [user, setUser] = useState<IUser | null>(null);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [description, setDescription] = useState("");

  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
  const [previewBanner, setPreviewBanner] = useState<string | null>(null);

  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [confirmToast, setConfirmToast] = useState<{ message: string; onConfirm: () => void; onCancel?: () => void; } | null>(null);
  const navigate = useNavigate();
  const [confirmLogout, setConfirmLogout] = useState(false);
  const handleLogout = async () => {
    try {
      await logoutUser();
      setToast({ message: "Logged out successfully!", type: "success" });
      navigate("/");
    } catch (err) {
      setToast({ message: "Logout failed!", type: "error" });
    }
  };

  useEffect(() => {
    getMe()
      .then((data) => {
        setUser(data);
        setName(data.name || "");
        setUsername(data.username || "");
        setEmail(data.email || "");
        setDescription(data.description || "");
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const handler = setTimeout(async () => {
      if (!username || username === user?.username) {
        setIsAvailable(true);
        return;
      }
      setIsChecking(true);
      const available = await checkUsernameAvailable(username);
      setIsAvailable(available);
      setIsChecking(false);
    }, 800);
    return () => clearTimeout(handler);
    }, [username, user?.username]);
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 2500); // 2.5s
            return () => clearTimeout(timer);
        }
    }, [toast]);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAvailable) {
      setToast({ message: "Username is already taken!", type: "error" });
      return;
    }
  
    setConfirmToast({
      message: "Save changes to your profile?",
      onConfirm: async () => {
        try {
          setLoading(true);
          const payload: any = {};
          if (name.trim() && name !== user?.name) payload.name = name.trim();
          if (username.trim() && username !== user?.username) payload.username = username.trim();
          if (email.trim() && email !== user?.email) payload.email = email.trim();
          if (description.trim() && description !== user?.description) payload.description = description.trim();
          if (password.trim()) payload.password = password.trim();

          const updated = await updateMe(payload);
          setUser(updated);
          setPassword("");
          setToast({ message: "Profile updated successfully!", type: "success" });
        } catch (err) {
          console.error(err);
          setToast({ message: "Failed to update profile!", type: "error" });
        } finally {
          setLoading(false);
        }
      },
    });
  };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!user) return;
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const previewUrl = URL.createObjectURL(file);
            setPreviewAvatar(previewUrl);

            setConfirmToast({
            message: "Save new avatar?",
            onConfirm: async () => {
                try {
                const updated = await uploadAvatar(user._id, file);
                setUser(updated);
                setToast({ message: "Avatar updated successfully!", type: "success" });
                } catch (err) {
                console.error(err);
                setToast({ message: "Failed to upload avatar!", type: "error" });
                }
            },
            onCancel: () => {
                // revert preview
                setPreviewAvatar(null);
            },
            });
        }
    };


    const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!user) return;
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const previewUrl = URL.createObjectURL(file);
            setPreviewBanner(previewUrl);

            setConfirmToast({
            message: "Save new banner?",
            onConfirm: async () => {
                try {
                const updated = await uploadBanner(user._id, file);
                setUser(updated);
                setToast({ message: "Banner updated successfully!", type: "success" });
                } catch (err) {
                console.error(err);
                setToast({ message: "Failed to upload banner!", type: "error" });
                }
            },
            onCancel: () => {
                // revert preview
                setPreviewBanner(null);
            },
            });
        }
    };


  const handleDelete = async () => {
    setConfirmToast({
      message: "Are you sure you want to delete your account?",
      onConfirm: async () => {
        await deleteMe();
        localStorage.clear();
        window.location.href = "/login";
      },
    });
  };

  if (!user) return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  return (
    <div className="flex justify-center mt-10">
      <div className="w-3/4 bg-white shadow-lg rounded-2xl p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left side */}
        <div className="col-span-1 flex flex-col items-center space-y-6">
          {/* Banner */}
          <div className="w-full h-32 md:h-40 rounded-xl overflow-hidden border border-gray-200 relative">
            <img
              src={previewBanner || user.bannerUrl || "https://via.placeholder.com/800x200"}
              alt="Banner"
              className="w-full h-full object-cover"
            />
          </div>
          <label className="w-full">
            <span className="text-sm text-gray-600">Change banner</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleBannerChange}
              className="mt-1 block w-full text-sm text-gray-500"
            />
          </label>

          {/* Avatar */}
          <div className="flex flex-col items-center space-y-3 mt-4">
            <img
              src={previewAvatar || user.avatarUrl || "https://via.placeholder.com/150"}
              alt="Avatar"
              className="w-40 h-40 rounded-full object-cover border-4 border-gray-200 shadow"
            />
            <label className="w-full">
              <span className="text-sm text-gray-600">Change avatar</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="mt-1 block w-full text-sm text-gray-500"
              />
            </label>
          </div>
            {/* Description */}
          <label className="w-full">
            <span className="block font-medium text-gray-700 mb-1">About Me</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write something about yourself..."
            className="border p-3 rounded-lg w-full h-28 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Right side */}
        <div className="col-span-2">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Your Profile</h1>

          <form onSubmit={handleUpdate} className="space-y-5">
            <div>
              <label className="block font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`border p-3 rounded-lg w-full focus:outline-none ${
                  !isAvailable
                    ? "border-red-500 focus:ring-red-400"
                    : "focus:ring-blue-400"
                }`}
              />
              {isChecking && <p className="text-sm text-gray-500">Checking...</p>}
              {!isAvailable && <p className="text-sm text-red-600">Username is already taken</p>}
              {isAvailable && username && username !== user?.username && (
                <p className="text-sm text-green-600">Username is available</p>
              )}
            </div>

            <div>
              <label className="block font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <button
              type="submit"
              disabled={!isAvailable || loading}
              className={`px-6 py-3 rounded-lg font-semibold text-white transition ${
                isAvailable
                  ? "bg-blue-500 hover:bg-blue-600 shadow"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {loading ? "Saving..." : "Update Profile"}
            </button>
          </form>

          <button
            onClick={handleDelete}
            className="mt-6 text-red-600 hover:text-red-800 font-medium"
          >
            Delete account
          </button>
          <button
                  className="px-4 py-2 rounded-md hover:bg-[#D82424] text-xs sm:text-sm md:text-base lg:text-lg"
                  onClick={() => setConfirmLogout(true)}
                >
                  Logout
          </button>
        </div>
      </div>
      
      {/* Toast */}
      {toast && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div
            className={`px-6 py-4 rounded-xl shadow-lg text-white text-lg transition-all ${
              toast.type === "success" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {toast.message}
          </div>
        </div>
      )}
      {confirmLogout && (
              <div className="fixed top-16 right-4 bg-gray-800 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3">
                <span>Are you sure you want to logout?</span>
                <button
                  className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
                  onClick={() => {
                    handleLogout();
                    setConfirmLogout(false);
                  }}
                >
                  Confirm
                </button>
                <button
                  className="bg-gray-500 px-3 py-1 rounded hover:bg-gray-600"
                  onClick={() => setConfirmLogout(false)}
                >
                  Cancel
                </button>
              </div>
            )}
      {/* Confirm Toast */}
      {confirmToast && (
        <div className="fixed inset-0 flex items-center justify-center z-50 ">
          <div className="bg-gray-800 text-white px-6 py-5 rounded-xl shadow-xl w-[400px] text-center">
            <span className="block mb-4">{confirmToast.message}</span>
            <div className="flex justify-center gap-4">
              <button
                className="bg-green-600 px-4 py-2 rounded hover:bg-green-700 transition-colors"
                onClick={() => {
                  confirmToast.onConfirm();
                  setConfirmToast(null);
                }}
              >
                Confirm
              </button>
              <button
                className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-500 transition-colors"
                onClick={() => {confirmToast.onCancel?.();setConfirmToast(null)}}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
