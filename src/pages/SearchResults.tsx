import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { searchPost } from "../services/post";
import { useNavigate } from "react-router-dom";
const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const [results, setResults] = useState<any[]>([]);
    const query = searchParams.get("q") || "";
    const navigate = useNavigate();
    useEffect(() => {
        if (query) {
            searchPost(query).then(setResults).catch(console.error);
        }
    }, [query]);

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-white">
                Search results for <span className="text-blue-500">"{query.substring(0,50)}..."</span>
            </h1>

            {results.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                    {results.map((post) => (
                        <div
                            key={post._id}
                            className="p-5 rounded-2xl shadow-md hover:shadow-lg transition-shadow bg-white border border-gray-200"
                        >
                            
                            <Link
                                to={`/post/${post._id}`}
                                className="text-xl font-semibold text-gray-900 hover:text-blue-600 break-words"
                            >
                                {post.title.substring(0,50)}
                            </Link>

                            
                            {post.content && (
                                <p className="text-gray-600 mt-2 line-clamp-3 break-words">
                                    {post.content.substring(0,100)}
                                </p>
                            )}

                            {/* Metadata */}
                            <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
                                <div>
                                    <span className="font-medium text-gray-700 hover:underline cursor-pointer" onClick={()=>navigate(`../user/${post.author._id}`)}>
                                        {post.author?.username || "Anonymous"}
                                    </span>
                                    {" • "}
                                    <span>
                                        {new Date(post.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 mt-4">No results found.</p>
            )}
        </div>
    );
};

export default SearchResults;
