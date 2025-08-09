import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../services/auth.ts";
import { useEffect, useState } from "react";

const Navbar = () => {
    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const [role, setRole] = useState<string | null>(null);
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

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    const handleLogout = () => {
        logoutUser();
        navigate("/");
    };

    return (
        <nav className="bg-blue-500 text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-xl font-bold">
                    MiniBlog
                </Link>
                <div className="space-x-4 flex items-center">
                    <Link
                        to="/"
                        className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                    >
                        Home
                    </Link>

                    {loggedIn && (
                        <Link
                            to="/modandadmin"
                            className="px-4 py-2 rounded-md bg-indigo-500 hover:bg-indigo-600 transition-colors duration-200"
                        >
                            User Management
                        </Link>
                    )}

                    {!loggedIn && (
                        <>
                            <Link
                                to="/login"
                                className="px-4 py-2 rounded-md bg-green-500 hover:bg-green-600 transition-colors duration-200"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="px-4 py-2 rounded-md bg-yellow-500 hover:bg-yellow-600 text-black transition-colors duration-200"
                            >
                                Register
                            </Link>
                        </>
                    )}
                    {loggedIn && (
                        <span className="flex items-center space-x-4">
                            <Link
                                to="/user/me"
                                className="px-4 py-2 rounded-md bg-purple-500 hover:bg-purple-600 transition-colors duration-200"
                            >
                                Profile
                            </Link>
                            <button
                                className="cursor-pointer px-4 py-2 rounded-md bg-red-500 hover:bg-red-600  transition-colors duration-200"
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
