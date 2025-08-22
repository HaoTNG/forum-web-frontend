import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchPost } from "../services/post";

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const [results, setResults] = useState([]);
    const query = searchParams.get("q") || "";

    useEffect(() => {
        if (query) {
            searchPost(query).then(setResults).catch(console.error);
        }
    }, [query]);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">Search results for "{query}"</h1>
            {results.length > 0 ? (
                <ul>
                    {results.map((post: any) => (
                        <li key={post._id} className="border-b py-2">
                            {post.title}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No results found.</p>
            )}
        </div>
    );
};

export default SearchResults;
