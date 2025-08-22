import { useEffect, useState } from "react";
import { getMe, updateMe, deleteMe } from "../services/user.ts";
import type { IUser } from "../services/user.ts";

export default function ProfilePage() {
    const [user, setUser] = useState<IUser | null>(null);
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        getMe()
            .then((data) => {
                setUser(data);
                setName(data.name || "");
                setUsername(data.username || "");
                setEmail(data.email || "");
            })
            .catch(console.error);
    }, []);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload: {
                name?: string;
                username?: string;
                email?: string;
                password?: string;
            } = {};

            if (name.trim() && name !== user?.name) payload.name = name.trim();
            if (username.trim() && username !== user?.username) payload.username = username.trim();
            if (email.trim() && email !== user?.email) payload.email = email.trim();
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

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete your account?")) {
            await deleteMe();
            localStorage.clear();
            window.location.href = "/login";
        }
    };

    if (!user) return <p>Loading..</p>;

    return (
        <div className="max-w-md mx-auto p-4 border rounded shadow bg-white">
            <h1 className="text-2xl font-bold mb-4">Your profile</h1>

            <form onSubmit={handleUpdate} className="space-y-3">
                <div>
                    <label className="block font-medium">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border p-2 rounded w-full"
                    />
                </div>

                <div>
                    <label className="block font-medium">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="border p-2 rounded w-full"
                    />
                </div>

                <div>
                    <label className="block font-medium">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border p-2 rounded w-full"
                    />
                </div>

                <div>
                    <label className="block font-medium">New Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border p-2 rounded w-full"
                    />
                </div>

                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
                >
                    Update Profile
                </button>
            </form>

            <button
                onClick={handleDelete}
                className="mt-4 text-red-600 hover:underline cursor-pointer"
            >
                Delete account
            </button>
        </div>
    );
}
