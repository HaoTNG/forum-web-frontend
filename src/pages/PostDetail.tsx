import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
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
import type { Comment } from "../services/comment";

export interface Post {
    _id: string;
    title: string;
    content: string;
    author: { _id: string; username: string };
    likes: string[];
    dislikes: string[];
}


const CommentItem = ({
                         comment,
                         currentUserId,
                         role,
                         onDelete,
                         onReply,
                     }: {
    comment: Comment;
    currentUserId: string | null;
    role: string | undefined;
    onDelete: (id: string, type: "comment" | "modComment") => void;
    onReply: (parentId: string, content: string) => void;
}) => {
    const [replyText, setReplyText] = useState("");
    const [showReplyBox, setShowReplyBox] = useState(false);

    const handleSubmitReply = () => {
        if (!replyText.trim()) return;
        onReply(comment._id, replyText);
        setReplyText("");
        setShowReplyBox(false);
    };

    return (
        <div className="border-l pl-4 mt-4">
            {/* Comment header */}
            <div className="flex justify-between items-center">
                <div>
          <span className="font-semibold">
            {comment.author?.username || "By deleted account"}
          </span>
                    <span className="ml-2 text-xs text-gray-500">
            {new Date(comment.createdAt).toLocaleDateString()}
          </span>
                </div>
                <div className="flex gap-2">
                    {currentUserId === comment.author?._id && (
                        <button
                            onClick={() => onDelete(comment._id, "comment")}
                            className="text-red-500 hover:text-red-700 text-sm"
                        >
                            ✕ Delete
                        </button>
                    )}
                    {(role === "admin" || role === "moderator") &&
                        currentUserId !== comment.author?._id && (
                            <button
                                onClick={() => onDelete(comment._id, "modComment")}
                                className="text-red-500 hover:text-red-700 text-sm"
                            >
                                ✕ Delete by mod/admin
                            </button>
                        )}
                </div>
            </div>

            {/* Comment content */}
            <p className="mt-1">{comment.content}</p>

            {/* Reply toggle */}
            <div className="mt-2 flex gap-3 text-sm text-blue-500">
                <button
                    onClick={() => setShowReplyBox(!showReplyBox)}
                    className="hover:underline"
                >
                    Reply
                </button>
            </div>

            {/* Reply box */}
            {showReplyBox && (
                <div className="mt-2">
          <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={2}
              className="w-full border rounded p-2 text-sm"
              placeholder="Write a reply..."
          />
                    <button
                        onClick={handleSubmitReply}
                        className="mt-1 bg-blue-500 text-white px-3 py-1 rounded text-sm"
                    >
                        Submit
                    </button>
                </div>
            )}

            {/* Recursive replies */}
            {comment.replies?.map((reply) => (
                <CommentItem
                    key={reply._id}
                    comment={reply}
                    currentUserId={currentUserId}
                    role={role}
                    onDelete={onDelete}
                    onReply={onReply}
                />
            ))}
        </div>
    );
};

/** ------------------------------
 *  Component: PostDetail
 *  ------------------------------ */
const PostDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [post, setPost] = useState<Post | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const [isDeleted, setIsDeleted] = useState(false);

    const currentUserId = localStorage.getItem("userid");
    const role = localStorage.getItem("role")?.toString();

    /** Fetch post + comments */
    useEffect(() => {
        if (!id) return;
        (async () => {
            try {
                const postData = await getPostById(id);
                setPost(postData);
                const commentsData = await getCommentByPostId(id);
                setComments(commentsData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        })();
    }, [id]);

    /** Auto-hide toast */
    useEffect(() => {
        if (!toast) return;
        const timer = setTimeout(() => setToast(null), 3000);
        return () => clearTimeout(timer);
    }, [toast]);

    /** Comment delete */
    const handleDelete = async (commentId: string, type: "comment" | "modComment") => {
        try {
            if (type === "comment") {
                await deleteComment(commentId);
            } else {
                await deleteCommentByMod(commentId);
            }
            setComments((prev) => removeCommentById(prev, commentId));
            setToast({
                message: type === "comment" ? "Comment deleted successfully!" : "Comment deleted by moderator!",
                type: "success",
            });
        } catch {
            setToast({ message: "Failed to delete", type: "error" });
        }
    };


    const handleReply = async (parentId: string, content: string) => {
        try {
            const reply = await createComment(content, id!, parentId);
            setComments((prev) => addReplyToComment(prev, parentId, reply));
        } catch {
            setToast({ message: "Failed to reply", type: "error" });
        }
    };


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


    const handleComment = async () => {
        if (!newComment.trim() || !id) return;
        const comment = await createComment(newComment, id, null);
        setComments((prev) => [comment, ...prev]);
        setNewComment("");
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


    if (!post) {
        return <div className="text-center mt-10 text-gray-600">Loading...</div>;
    }

    return (
        <div className="max-w-3xl mx-auto mt-6 p-4">
            {/* Admin/Mod control */}
            {(role === "admin" || role === "moderator") && (
                <button
                    onClick={async () => {
                        await deletePostByMod(post._id);
                        setIsDeleted(true);
                    }}
                    className="text-red-500 hover:text-red-700 text-sm font-medium border p-1 rounded"
                >
                    ✕ Delete post by mod
                </button>
            )}


            {String(post.author?._id) === currentUserId && (
                <div className="mt-4 flex gap-3">
                    <Link to={`/edit/${post._id}`} className="text-blue-500 hover:underline">
                        Edit
                    </Link>
                    <button
                        className="text-red-500 hover:underline"
                        onClick={async () => {
                            await deletePost(post._id);
                            setIsDeleted(true);
                        }}
                    >
                        Delete
                    </button>
                </div>
            )}


            <h1 className="text-3xl font-bold mt-3">{post.title}</h1>
            <p className="text-gray-600 mb-4">By {post.author?.username}</p>
            <p className="leading-relaxed">{post.content}</p>


            <div className="flex gap-4 mt-4">
                <button
                    onClick={handleLike}
                    className="text-green-600 font-semibold flex items-center gap-1"
                >
                    👍 {post.likes.length}
                </button>
                <button
                    onClick={handleDislike}
                    className="text-red-600 font-semibold flex items-center gap-1"
                >
                    👎 {post.dislikes.length}
                </button>
            </div>

            {/* Comment form */}
            <div className="mt-6">
        <textarea
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows={3}
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
        />
                <button
                    onClick={handleComment}
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Submit
                </button>
            </div>


            <div className="mt-6">
                <h2 className="text-xl font-semibold mb-4">Comments</h2>
                {comments.length === 0 ? (
                    <p className="text-gray-500 italic">No comments yet.</p>
                ) : (
                    comments.map((comment) => (
                        <CommentItem
                            key={comment._id}
                            comment={comment}
                            currentUserId={currentUserId}
                            role={role}
                            onDelete={handleDelete}
                            onReply={handleReply}
                        />
                    ))
                )}
            </div>


            {toast && (
                <div
                    className={`fixed bottom-5 right-5 px-5 py-3 rounded-xl shadow-lg text-white transition-all ${
                        toast.type === "success" ? "bg-green-500" : "bg-red-500"
                    }`}
                >
                    {toast.message}
                </div>
            )}
        </div>
    );
};


function removeCommentById(comments: Comment[], id: string): Comment[] {
    return comments
        .filter((c) => c._id !== id)
        .map((c) => ({
            ...c,
            replies: removeCommentById(c.replies || [], id),
        }));
}

function addReplyToComment(
    comments: Comment[],
    parentId: string,
    reply: Comment
): Comment[] {
    return comments.map((c) =>
        c._id === parentId
            ? { ...c, replies: [...(c.replies || []), reply] }
            : { ...c, replies: addReplyToComment(c.replies || [], parentId, reply) }
    );
}

export default PostDetail;
