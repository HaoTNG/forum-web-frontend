import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {getPostById, deletePost, likePost, dislikePost} from "../services/post";
import {getCommentByPostId, createComment, deleteComment} from "../services/comment.ts";
import type {Comment} from "../services/comment.ts";

export interface Post {
    _id: string;
    title: string;
    content: string;
    author: {
        _id: string;
        username: string;
    };
    likes: string[];
    dislikes: string[];
}

const PostDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState<Post | null>(null);
    const currentUserId = localStorage.getItem("userid");

    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");

    useEffect(() => {
        if (!id) return; // Chỉ chạy khi id đã sẵn sàng

        const fetchData = async () => {
            try {
                const postData = await getPostById(id);
                setPost(postData);

                const commentsData = await getCommentByPostId(id);
                setComments(commentsData);
            } catch (error) {
                console.error("Error fetching post or comments:", error);
            }
        };

        fetchData();
    }, [id]);




    const handleDelete = async () => {

        const confirmed = window.confirm("do you really want to delete?");
        if (!confirmed) return;

        try {
            await deletePost(post!._id);
            navigate("/");
        } catch (err) {
            console.error(err);
            alert("failed to delete this post");
        }
    };

    const handleLike = async () =>{
        await likePost(post!._id);
        const updatedPost = await getPostById(post!._id);
        setPost(updatedPost);
    }
    const handleDislike = async () =>{
        await dislikePost(post!._id);
        const updatedPost = await getPostById(post!._id);
        setPost(updatedPost);
    }
    const handleComment = async () => {
        if (!newComment.trim() || !id) return;
        const comment = await createComment(newComment, id);
        setComments(prev => [comment ,...prev]);
        setNewComment("");
    };
    const handleDeleteComment = async (id: string) => {
        try{
            await deleteComment(id);
            setComments(prev => prev.filter(comment => comment._id !== id))
        }catch(error){
            console.error(error);
        }
    }



    if (!post) return <div>Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto mt-6">
            {String(post.author._id) === currentUserId && (
                <div className="mt-4 flex gap-3">

                    <Link
                        to={`/edit/${post._id}`}
                        className="text-blue-500 hover:underline"
                    >
                        Edit
                    </Link>


                    <button
                        className="text-red-500 hover:underline"
                        onClick={handleDelete}
                    >
                        Delete
                    </button>
                </div>
            )}
            <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
            <p className="text-gray-700 mb-4">By {post.author.username}</p>
            <p>{post.content}</p>
            <div className="flex gap-4 mt-4">
                <button onClick={handleLike} className="text-green-500">Like: {post.likes.length}</button>
                <button onClick={handleDislike} className="text-green-500">Dislike: {post.dislikes.length}</button>
            </div>
            <div className="mt-6">
                <textarea
                    className="w-full border rounded p-2"
                    rows={3}
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                />
                <button
                    onClick={handleComment}
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
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
                        <div
                            key={comment._id}
                            className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-3 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-gray-800">
                                        {comment.author
                                            ? `${comment.author?.username}`
                                        : "By deleted account"}</span>
                                    <span className="text-xs text-gray-500">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
                                </div>
                                {localStorage.getItem("userid")?.toString() === comment.author?._id.toString() && (
                                    <button
                                        onClick={() => handleDeleteComment(comment._id)}
                                        className="text-red-500 hover:text-red-700 text-sm font-medium border p-1"
                                    >
                                        ✕ Delete comment
                                    </button>
                                )}
                            </div>
                            <p className="mt-2 text-gray-700">{comment.content}</p>
                        </div>
                    ))
                )}
            </div>




        </div>
    );
};

export default PostDetail;
