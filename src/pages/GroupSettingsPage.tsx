// === GroupSettingsPage.tsx =================================================
// Trang cài đặt nhóm — cho phép admin cập nhật:
// - Banner (ảnh bìa)
// - Avatar (ảnh đại diện)
// - Tên nhóm
// - Mô tả nhóm
// ===========================================================================

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  getGroup,
  updateGroup,
  uploadGroupAvatar,
  uploadGroupBanner,
} from "../services/group";

export default function GroupSettingsPage() {
  const { id } = useParams(); // Lấy groupId từ URL
  const [group, setGroup] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Preview ảnh mới trước khi lưu
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
  const [previewBanner, setPreviewBanner] = useState<string | null>(null);

  // Form input
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Toast hiển thị kết quả
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [confirmToast, setConfirmToast] = useState<{ message: string; onConfirm: () => void; onCancel?: () => void; } | null>(null);

  // === FETCH GROUP =========================================================
  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const data = await getGroup(id!);
        setGroup(data);
      } catch (err) {
        console.error("Failed to fetch group:", err);
        setGroup(null);
      } finally {
        setLoading(false);
      }
    };
    fetchGroup();
  }, [id]);

  // Đồng bộ form với group khi fetch xong
    useEffect(() => {
        if (group) {
        setName(group.name || "");
        setDescription(group.description || "");
        }
    }, [group]);
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 2500); // 2.5s
            return () => clearTimeout(timer);
        }
    }, [toast]);


  // === HANDLE UPDATE INFO ==================================================
  const handleUpdateInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!group) return;

    setConfirmToast({
      message: "Save changes to group information?",
      onConfirm: async () => {
        setLoading(true);
        try {
          const updated = await updateGroup(
            group._id,
            name || group.name,
            description || group.description
          );
          setGroup(updated);
          setToast({
            message: "Group information updated successfully!",
            type: "success",
          });
        } catch (err: any) {
          console.error(err);
          setToast({
            message: err.message || "Failed to update group info",
            type: "error",
          });
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && group) {
      const file = e.target.files[0];
      setPreviewAvatar(URL.createObjectURL(file));

      setConfirmToast({
        message: "Save new group avatar?",
        onConfirm: async () => {
          try {
            const updated = await uploadGroupAvatar(group._id, file);
            setGroup(updated);
            setToast({ message: "Avatar updated successfully!", type: "success" });
          } catch (err) {
            console.error(err);
            setToast({ message: "Failed to upload avatar", type: "error" });
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
    if (e.target.files && e.target.files[0] && group) {
      const file = e.target.files[0];
      setPreviewBanner(URL.createObjectURL(file));

      setConfirmToast({
        message: "Save new group banner?",
        onConfirm: async () => {
          try {
            const updated = await uploadGroupBanner(group._id, file);
            setGroup(updated);
            setToast({ message: "Banner updated successfully!", type: "success" });
          } catch (err) {
            console.error(err);
            setToast({ message: "Failed to upload banner", type: "error" });
          }
        },
            onCancel: () => {
            // revert preview
            setPreviewAvatar(null);
        },
      });
    }
  };

  // === UI RENDER ===========================================================
  if (loading) return <p className="p-6 text-gray-500">Loading group...</p>;
  if (!group) return <p className="p-6 text-red-500">Group not found.</p>;

  return (
    <div className="p-6 bg-white rounded-xl shadow space-y-6">
      <h2 className="text-2xl font-bold">Group Settings</h2>

      {/* === Banner Section === */}
      <div>
        <img
          src={previewBanner || group.bannerUrl || "/default-group-banner.png"}
          alt="Group Banner"
          className="w-full h-48 object-cover rounded-lg shadow"
        />
        <label className="hover:cursor-pointer hover:bg-gray-300">
          <span className="block text-sm text-gray-600 mt-2">Change banner</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleBannerChange}
            className="block w-full text-sm text-gray-500"
          />
        </label>
      </div>

      {/* === Avatar Section === */}
      <div className="flex items-center space-x-4">
        <img
          src={previewAvatar || group.avatarUrl || "/default-group-avatar.png"}
          alt="Group Avatar"
          className="w-24 h-24 rounded-full object-cover border-2 border-gray-200 shadow"
        />
        <label className="hover:cursor-pointer hover:bg-gray-300">
          <span className="block text-sm text-gray-600">Change avatar</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="block w-full text-sm text-gray-500"
          />
        </label>
      </div>

      {/* === Update Form === */}
      <form onSubmit={handleUpdateInfo} className="p-4 border rounded-md max-w-md">
        <h3 className="text-xl font-semibold mb-3">Edit group information</h3>

        <div className="mb-2">
          <label className="block text-sm font-medium">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 w-full rounded"
            placeholder="Enter new name"
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 w-full rounded"
            placeholder="Enter new description"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>

      {/* === Toast hiển thị trạng thái === */}
      {toast && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div
            className={`px-6 py-4 rounded-xl shadow-lg text-white text-lg pointer-events-auto transition-all ${
              toast.type === "success" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {toast.message}
          </div>
        </div>
      )}

      {/* === Confirm Toast === */}
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
                onClick={() => {
                    confirmToast.onCancel?.();
                    setConfirmToast(null);
                }}
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
