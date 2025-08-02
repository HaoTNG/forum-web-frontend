import {Link} from "react-router-dom";

const Navbar = () => {
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
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;