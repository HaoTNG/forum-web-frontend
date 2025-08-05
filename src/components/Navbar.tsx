import {Link} from "react-router-dom";
import { logoutUser} from "../services/auth.ts";
import {useEffect, useState} from "react";

const Navbar = () => {
    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    useEffect(()=>{
        const token = localStorage.getItem("accessToken");
        setLoggedIn(!!token);

        const handleStorageChange = () => {
            const token = localStorage.getItem("accessToken");
            setLoggedIn(!!token);
        };
        window.addEventListener("storage", handleStorageChange);

        return ()=>{
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    return (
        <nav    className="bg-blue-500 text-white p-4 shadow-md">
            <div  className="container mx-auto flex justify-between items-center" >
                {/*Logo*/}
                <Link to="/" className="text-xl font-bold">
                    MiniBlog
                </Link>
                {/*Menu*/}
                <div className="space-x-4">
                    <Link to="/">Home</Link>
                    {!loggedIn && (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/register">Register</Link>
                        </>
                    )}
                    {loggedIn && (<button className="cursor-pointer " onClick={logoutUser}>Logout</button>)}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;