import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  getPostById,
  deletePost,
  likePost,
  dislikePost,
  deletePostByMod,
} from "../services/post";
import {
  getCommentByPostId,
  createComment,
  deleteComment,
  deleteCommentByMod,
} from "../services/comment";
import type { Comment as CommentBase } from "../services/comment";
import type { Post } from "../services/post";
import { useAuth } from "../components/AuthContext";

/** ---------- Local types ---------- */
type CommentNode = CommentBase & { replies?: CommentNode[] };

/** ---------- UI helpers ---------- */
const Avatar = ({ name, imageUrl }: { name?: string; imageUrl?: string | null }) => {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className="h-9 w-9 rounded-full object-cover"
      />
    );
  }
  const initial = (name?.trim()?.[0] || "?").toUpperCase();
  return (
    <div className="h-9 w-9 rounded-full bg-gray-300 flex items-center justify-center text-sm font-bold text-gray-700">
      {initial}
    </div>
  );
};




const ActionButton = ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
  <button
    onClick={onClick}
    className="px-3 py-1 rounded-full hover:bg-gray-100 text-sm text-gray-600"
  >
    {children}
  </button>
);

/** ---------- Recursive CommentItem ---------- */
const CommentItem = ({
  comment,
  currentUserId,
  role,
  onDelete,
  onReply,
  level = 1,
  parentId,
}: {
  comment: CommentNode;
  currentUserId: string | null;
  role: string | undefined;
  onDelete: (id: string, type: "comment" | "modComment") => void;
  onReply: (parentId: string, content: string) => void;
  level?: number;
  parentId?: string;
}) => {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");
  const replyInputRef = useRef<HTMLTextAreaElement | null>(null);

  const authorName = comment.author?.username || "Deleted user";

  const openReplyBox = (prefill?: string) => {
    setShowReplyBox(true);
    setTimeout(() => {
      if (prefill) setReplyText(prefill);
      replyInputRef.current?.focus();
      const el = replyInputRef.current;
      if (el) el.setSelectionRange(el.value.length, el.value.length);
    }, 0);
  };

  const handleSubmitReply = () => {
    const content = replyText.trim();
    if (!content) return;

    let targetId = comment._id;
    if (level >= 3) {
      // reply level >=3 → gắn vào parent của comment hiện tại (cùng cấp)
      targetId = parentId || comment._id;
    }

    onReply(targetId, content);
    setReplyText("");
    setShowReplyBox(false);
  };

  return (
    <div className="flex gap-3 mb-4">
      <Avatar
        name={comment.author?.username}
        imageUrl={comment.author?.avatarUrl}
      />

      <div className="flex-1">
        <div className="inline-block bg-gray-100 rounded-2xl px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-800">{authorName}</span>
            <span className="text-xs text-gray-500">
              {new Date(comment.createdAt).toLocaleString()}
            </span>
          </div>
          <p className="mt-1 text-gray-800">{comment.content}</p>
        </div>

        <div className="mt-1 flex items-center gap-1">
          <ActionButton onClick={() => openReplyBox(`@${authorName} `)}>Reply</ActionButton>
          {currentUserId === comment.author?._id && (
            <ActionButton onClick={() => onDelete(comment._id, "comment")}>Delete</ActionButton>
          )}
          {(role === "admin" || role === "moderator") && currentUserId !== comment.author?._id && (
            <ActionButton onClick={() => onDelete(comment._id, "modComment")}>Delete by mod</ActionButton>
          )}
        </div>

        {comment.replies?.length > 0 && (
          <div className="mt-2 ml-10 space-y-2">
            {comment.replies?.map((r) => (
              <CommentItem
                key={r._id}
                comment={r}
                currentUserId={currentUserId}
                role={role}
                onDelete={onDelete}
                onReply={onReply}
                level={level + 1}
                parentId={comment._id}
              />
            ))}
          </div>
        )}

        {showReplyBox && (
          <div className="mt-3 ml-10">
            <textarea
              ref={replyInputRef}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={2}
              className="w-full border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder={`Reply to ${authorName}...`}
            />
            <div className="mt-2 flex gap-2">
              <button
                onClick={handleSubmitReply}
                className="bg-blue-500 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-blue-600"
              >
                Submit
              </button>
              <button
                onClick={() => {
                  setShowReplyBox(false);
                  setReplyText("");
                }}
                className="px-4 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/** ---------- PostDetail ---------- */
const PostDetail = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<CommentNode[]>([]);
  const [newComment, setNewComment] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [confirmToast, setConfirmToast] = useState<{
    message: string;
    onConfirm: () => void;
  } | null>(null);
  const [isDeleted, setIsDeleted] = useState(false);

  const currentUserId = user?._id ?? null;
  const role = user?.role;

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const postData = await getPostById(id);
        setPost(postData);
        const commentsData = (await getCommentByPostId(id)) as CommentNode[];
        setComments(commentsData);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [id]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  /** Delete comment */
  const handleDelete = async (commentId: string, type: "comment" | "modComment") => {
    try {
      if (type === "comment") await deleteComment(commentId);
      else await deleteCommentByMod(commentId);

      setComments((prev) => removeCommentById(prev, commentId));
      setToast({
        message: type === "comment" ? "Comment deleted!" : "Comment deleted by moderator!",
        type: "success",
      });
    } catch {
      setToast({ message: "Failed to delete", type: "error" });
    }
  };

  /** Reply */
  const handleReply = async (parentId: string, content: string) => {
    try {
      const reply = (await createComment(content, id!, parentId)) as CommentBase;
      setComments((prev) => addReplyToComment(prev, parentId, reply));
    } catch {
      setToast({ message: "Failed to reply", type: "error" });
    }
  };

  /** New top-level comment */
  const handleComment = async () => {
    if (!newComment.trim() || !id) return;
    const comment = (await createComment(newComment, id, null)) as CommentBase;
    setComments((prev) => [{ ...comment, replies: [] }, ...prev]);
    setNewComment("");
  };

  /** Like / Dislike */
  const handleLike = async () => {
    if (!post) return;
    await likePost(post._id);
    setPost(await getPostById(post._id));
  };
  const handleDislike = async () => {
    if (!post) return;
    await dislikePost(post._id);
    setPost(await getPostById(post._id));
  };

  /** Request delete with confirm */
  const requestDeleteComment = (commentId: string, type: "comment" | "modComment") => {
    setConfirmToast({
      message: "Are you sure you want to delete this comment?",
      onConfirm: () => handleDelete(commentId, type),
    });
  };

  const requestDeletePost = (isMod: boolean) => {
    setConfirmToast({
      message: "Are you sure you want to delete this post?",
      onConfirm: async () => {
        if (isMod) await deletePostByMod(post!._id);
        else await deletePost(post!._id);
        setIsDeleted(true);
      },
    });
  };

  if (isDeleted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <h2 className="text-2xl font-bold mb-2">This post has been deleted.</h2>
        <p className="text-gray-600 mb-4">It is no longer available.</p>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go to Home
        </button>
      </div>
    );
  }

  if (!post) return <div className="text-center mt-10 text-gray-600">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto mt-6">
      <div className="bg-white p-5 rounded-2xl shadow border border-gray-200">
        {/* Admin/Mod */}
        {(role === "admin" || role === "moderator") && (
          <button
            onClick={() => requestDeletePost(true)}
            className="text-red-600 hover:text-red-800 text-sm font-medium border px-2 py-1 rounded-md mb-3"
          >
            ✕ Delete post by mod
          </button>
        )}

        {/* Owner */}
        {String(post.author?._id) === currentUserId && (
          <div className="mt-1 flex gap-3 text-sm">
            <Link to={`/edit/${post._id}`} className="text-blue-600 hover:underline font-medium">
              ✏️ Edit
            </Link>
            <button
              className="text-red-600 hover:underline font-medium"
              onClick={() => requestDeletePost(false)}
            >
              🗑 Delete
            </button>
          </div>
        )}

        <h1 className="text-3xl font-bold mt-2">{post.title}</h1>
        <p className="text-gray-600 mb-3">By {post.author?.username}</p>
        <p className="leading-relaxed text-gray-800 whitespace-pre-line">{post.content}</p>

        {post.images && post.images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
            {post.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`post-${idx}`}
                className="w-full h-60 object-cover rounded-xl"
              />
            ))}
          </div>
        )}

        {/* Reactions */}
        <div className="mt-4 flex items-center gap-4 text-[15px]">
          <button
            onClick={handleLike}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-100 text-gray-700"
          >
            👍 <span>{post.likes.length}</span>
          </button>
          <button
            onClick={handleDislike}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-100 text-gray-700"
          >
            👎 <span>{post.dislikes.length}</span>
          </button>
        </div>

        {/* New comment */}
        <div className="mt-6 flex gap-3">
          <Avatar name={user?.username} imageUrl={user?.avatarUrl} />
          <div className="flex-1">
            <textarea
              className="w-full border rounded-2xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows={3}
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <div className="mt-2">
              <button
                onClick={handleComment}
                className="bg-blue-500 text-white px-5 py-2 rounded-xl hover:bg-blue-600"
              >
                Submit
              </button>
            </div>
          </div>
        </div>

        {/* Comments */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-3">Comments</h2>
          {comments.length === 0 ? (
            <p className="text-gray-500 italic">No comments yet.</p>
          ) : (
            comments.map((c) => (
              <CommentItem
                key={c._id}
                comment={c}
                currentUserId={currentUserId}
                role={role}
                onDelete={requestDeleteComment}
                onReply={handleReply}
              />
            ))
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 px-5 py-3 rounded-xl shadow-lg text-white transition-all ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Confirm Toast */}
      {confirmToast && (
        <div className="fixed bottom-6 right-6 bg-gray-800 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3">
          <span>{confirmToast.message}</span>
          <button
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
            onClick={() => {
              confirmToast.onConfirm();
              setConfirmToast(null);
            }}
          >
            Confirm
          </button>
          <button
            className="bg-gray-500 px-3 py-1 rounded hover:bg-gray-600"
            onClick={() => setConfirmToast(null)}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

/** ---------- Helpers ---------- */
function addReplyToComment(
  comments: CommentNode[],
  parentId: string,
  reply: CommentBase
): CommentNode[] {
  return comments.map((c) => {
    if (c._id === parentId) {
      return { ...c, replies: [...(c.replies || []), { ...reply, replies: [] }] };
    } else if (c.replies?.length) {
      return { ...c, replies: addReplyToComment(c.replies, parentId, reply) };
    }
    return c;
  });
}

function removeCommentById(comments: CommentNode[], id: string): CommentNode[] {
  return comments
    .filter((c) => c._id !== id)
    .map((c) => ({ ...c, replies: c.replies ? removeCommentById(c.replies, id) : [] }));
}

export default PostDetail;
