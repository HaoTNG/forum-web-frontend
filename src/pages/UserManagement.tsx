import { useEffect, useState } from "react";
import { getAllUsers, deleteUser, updateUserRole, type IUser } from "../services/user.ts";
import { Link } from "react-router-dom";

const getUserRole = () => localStorage.getItem("role");

interface ModalProps {
    message: string;
    onConfirm?: () => void;
    onClose: () => void;
    confirmText?: string;
    cancelText?: string;
    showCancel?: boolean;
}

function Modal({ message, onConfirm, onClose, confirmText = "OK", cancelText = "Cancel", showCancel = false }: ModalProps) {
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm text-center">
                <p className="mb-4">{message}</p>
                <div className="flex justify-center gap-4">
                    {showCancel && (
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition"
                        >
                            {cancelText}
                        </button>
                    )}
                    <button
                        onClick={() => { onConfirm?.(); onClose(); }}
                        className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function UserManagement() {
    const [users, setUsers] = useState<IUser[]>([]);
    const [modal, setModal] = useState<React.ReactNode | null>(null);
    const role = getUserRole();

    const fetchUsers = async () => {
        const data = await getAllUsers();
        setUsers(data);
    };

    useEffect(() => {
        if (role === "admin" || role === "moderator") fetchUsers();
    }, []);

    if (role !== "admin" && role !== "moderator") {
        return (
            <div className="text-center mt-20">
                <p className="text-red-500 text-xl font-semibold mb-6">
                    🚫 You don't have permission to update, ban users or manage their actions.
                </p>
                <p className="text-gray-700 mb-10">
                    You need the <span className="font-semibold">moderator</span> or{" "}
                    <span className="font-semibold">admin</span> role to perform these actions.
                </p>
                <Link
                    to="/user/me"
                    className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-600 transition"
                >
                    View Your Profile
                </Link>
            </div>
        );
    }

    const handleDelete = (id: string) => {
        if (role !== "admin") {
            setModal(
                <Modal
                    message="Moderators don't have enough authorization to ban users. Need to be an admin to perform this action."
                    onClose={() => setModal(null)}
                />
            );
            return;
        }

        setModal(
            <Modal
                message="Are you sure you want to delete this user?"
                showCancel
                onConfirm={async () => { await deleteUser(id); await fetchUsers(); }}
                onClose={() => setModal(null)}
                confirmText="Delete"
                cancelText="Cancel"
            />
        );
    };

    const handleRoleChange = (id: string, newRole: string) => {
        if (role !== "admin") {
            setModal(
                <Modal
                    message="Moderators don't have enough authorization to change roles. Need to be an admin to perform this action."
                    onClose={() => setModal(null)}
                />
            );
            return;
        }

        setModal(
            <Modal
                message={`Are you sure you want to change this user's role to "${newRole}"?`}
                showCancel
                onConfirm={async () => { await updateUserRole(id, newRole); await fetchUsers(); }}
                onClose={() => setModal(null)}
                confirmText="Update"
                cancelText="Cancel"
            />
        );
    };

    return (
        <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8 relative">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">User Management</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-gray-100 text-gray-700">
                    <tr>
                        <th className="px-4 py-3 text-left">Username</th>
                        <th className="px-4 py-3 text-left">Email</th>
                        <th className="px-4 py-3 text-left">Role</th>
                        <th className="px-4 py-3 text-left">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((u, index) => (
                        <tr
                            key={u._id}
                            className={`border-t border-gray-200 hover:bg-gray-50 ${
                                index % 2 === 0 ? "bg-white" : "bg-gray-50"
                            }`}
                        >
                            <td className="px-4 py-3">{u.username}</td>
                            <td className="px-4 py-3">{u.email}</td>
                            <td className="px-4 py-3">
                                {role === "admin" ? (
                                    <select
                                        value={u.role}
                                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                        className="border rounded px-2 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    >
                                        <option value="user">User</option>
                                        <option value="moderator">Moderator</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                ) : (
                                    <span className="px-2 py-1 rounded bg-gray-200 text-gray-800">{u.role}</span>
                                )}
                            </td>
                            <td className="px-4 py-3">
                                <button
                                    onClick={() => handleDelete(u._id)}
                                    className={`px-3 py-1 rounded shadow transition ${
                                        role === "admin"
                                            ? "bg-red-500 text-white hover:bg-red-600"
                                            : "bg-gray-300 text-gray-600 cursor-not-allowed"
                                    }`}
                                >
                                    Ban
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {modal}
        </div>
    );
}
