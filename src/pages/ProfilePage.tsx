import { useEffect, useState } from "react";
import { getMe, updateMe, deleteMe, uploadAvatar } from "../services/user.ts";
import type { IUser } from "../services/user.ts";
import { checkUsernameAvailable } from "../services/user.ts";

export default function ProfilePage() {
    const [user, setUser] = useState<IUser | null>(null);
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [description, setDescription] = useState("");
    const [avatar, setAvatar] = useState<File | null>(null);

    const [isChecking, setIsChecking] = useState(false);
    const [isAvailable, setIsAvailable] = useState(true);

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
            console.log(available);
            setIsChecking(false);
        }, 1000);
        return () => clearTimeout(handler);
    }, [username, user?.username]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAvailable) {
            alert("Username is already taken. Please choose another one.");
            return;
        }
        try {
            const payload: {
                name?: string;
                username?: string;
                email?: string;
                password?: string;
                description?: string;
            } = {};
            if (name.trim() && name !== user?.name) payload.name = name.trim();
            if (username.trim() && username !== user?.username) payload.username = username.trim();
            if (email.trim() && email !== user?.email) payload.email = email.trim();
            if (description.trim() && description !== user?.description) payload.description = description.trim();
            if (password.trim()) payload.password = password.trim();

            const updated = await updateMe(payload);
            setUser(updated);
            setPassword("");
            alert("Profile updated!");
        } catch (err) {
            console.error(err);
            alert("Failed to update profile");
        }
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!user) return;
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAvatar(file);
            try {
                const updated = await uploadAvatar(user._id, file);
                setUser(updated);
                alert("Avatar updated!");
            } catch (err) {
                console.error(err);
                alert("Failed to upload avatar");
            }
        }
    };

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete your account?")) {
            await deleteMe();
            localStorage.clear();
            window.location.href = "/login";
        }
    };

    if (!user) return <p className="text-center mt-10 text-gray-500">Loading...</p>;

    return (
        <div className="flex justify-center mt-10">
            <div className="w-3/4 bg-white shadow-lg rounded-2xl p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left side */}
                <div className="col-span-1 flex flex-col items-center space-y-4">
                    <img
                        src={user.avatarUrl || "https://via.placeholder.com/150"}
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
                            disabled={!isAvailable}
                            className={`px-6 py-3 rounded-lg font-semibold text-white transition ${
                                isAvailable
                                    ? "bg-blue-500 hover:bg-blue-600 shadow"
                                    : "bg-gray-400 cursor-not-allowed"
                            }`}
                        >
                            Update Profile
                        </button>
                    </form>

                    <button
                        onClick={handleDelete}
                        className="mt-6 text-red-600 hover:text-red-800 font-medium"
                    >
                        Delete account
                    </button>
                </div>
            </div>
        </div>
    );
}
