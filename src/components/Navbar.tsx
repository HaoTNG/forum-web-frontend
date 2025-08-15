import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../services/auth";
import { useEffect, useState } from "react";

const Navbar = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [role, setRole] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        const storedRole = localStorage.getItem("role");
        setLoggedIn(!!token);
        setRole(storedRole);

        const handleStorageChange = () => {
            const token = localStorage.getItem("accessToken");
            const storedRole = localStorage.getItem("role");
            setLoggedIn(!!token);
            setRole(storedRole);
        };
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    const handleLogout = () => {
        logoutUser();
        navigate("/");
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
            setSearchTerm("");
        }
    };

    return (
        <nav className="sticky top-0 z-50 bg-[#122640] text-white p-2.5 shadow-md ">
            <div className=" flex justify-around items-center">
                <Link to="/" className="flex items-center text-base sm:text-lg md:text-xl lg:text-2xl font-bold">

                    <span>Zforum</span>
                </Link>



                <form onSubmit={handleSearchSubmit} className="flex items-center w-full max-w-[800px]">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-grow h-10 px-4 text-sm text-black bg-white border border-gray-300 rounded-l-full focus:outline-none focus:border-blue-500"
                    />
                    <button
                        type="submit"
                        className="h-10 w-12 flex items-center justify-center bg-gray-100 border border-l-0 border-gray-300 rounded-r-full hover:bg-gray-200"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" className="text-gray-600">
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                        </svg>
                    </button>
                </form>


                <div className="flex items-center">
                    <Link to="/" className="px-4 py-2 rounded-md h-full hover:bg-[#1c4980] text-xs sm:text-sm md:text-base lg:text-lg">
                        Home
                    </Link>
                    {loggedIn && (
                        <Link
                            to="/modandadmin"
                            className="px-4 py-2 rounded-md  hover:bg-[#1c4980] text-xs sm:text-sm md:text-base lg:text-lg"
                        >
                            Management
                        </Link>
                    )}
                    {!loggedIn ? (
                        <>
                            <Link
                                to="/login"
                                className="px-4 py-2 rounded-md hover:bg-[#1c4980] text-xs sm:text-sm md:text-base lg:text-lg"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="px-4 py-2 rounded-md  hover:bg-[#1c4980] text-xs sm:text-sm md:text-base lg:text-lg "
                            >
                                Register
                            </Link>
                        </>
                    ) : (
                        <span className="flex items-center ">
                            <Link
                                to="/user/me"
                                className="px-4 py-2 rounded-md  hover:bg-[#1c4980] text-xs sm:text-sm md:text-base lg:text-lg"
                            >
                                Profile
                            </Link>
                            <button
                                className="cursor-pointer px-4 py-2 rounded-md  hover:bg-[#1c4980] text-xs sm:text-sm md:text-base lg:text-lg"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </span>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
