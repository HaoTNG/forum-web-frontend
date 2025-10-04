import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getGroup, joinGroup, leaveGroup, type Group } from "../services/group";

interface Toast {
  type: "success" | "error";
  message: string;
}

interface ConfirmToast {
  message: string;
  onConfirm: () => void;
}

export default function GroupDetail() {
  const { id } = useParams<{ id: string }>();
  const [group, setGroup] = useState<Group | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const [confirmToast, setConfirmToast] = useState<ConfirmToast | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const res = await getGroup(id!);
        setGroup(res);
      } catch (err: any) {
        setToast({ type: "error", message: err.message || "Failed to load group" });
      }
    };
    fetchGroup();
  }, [id]);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleJoin = () => {
    setConfirmToast({
      message: "Bạn có chắc muốn join group này?",
      onConfirm: async () => {
        try {
          setLoading(true);
          const res = await joinGroup(id!);
          setGroup(res);
          showToast("success", "Joined group successfully!");
        } catch (err: any) {
          showToast("error", err.message || "Failed to join group");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleLeave = () => {
    setConfirmToast({
      message: "Bạn có chắc muốn rời group này?",
      onConfirm: async () => {
        try {
          setLoading(true);
          const res = await leaveGroup(id!);
          setGroup(res);
          showToast("success", "Left group successfully!");
        } catch (err: any) {
          showToast("error", err.message || "Failed to leave group");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  if (!group) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2">{group.name}</h1>
      <p className="mb-4 text-gray-700">{group.description}</p>

      {group.isMember ? (
        <button
          onClick={handleLeave}
          disabled={loading}
          className="bg-red-500 text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          Leave Group
        </button>
      ) : (
        <button
          onClick={handleJoin}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          Join Group
        </button>
      )}

      <h2 className="mt-6 text-xl font-semibold">Members</h2>
      <p>{group.memberCount} members</p>

      {/* Toast (center, no overlay) */}
      {toast && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div
            className={`px-6 py-4 rounded-xl shadow-lg text-white text-lg pointer-events-auto ${
              toast.type === "success" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {toast.message}
          </div>
        </div>
      )}

      {/* Confirm Toast (center, no overlay) */}
      {confirmToast && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
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
                onClick={() => setConfirmToast(null)}
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
