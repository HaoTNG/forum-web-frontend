import { useState } from "react";
import { registerUser } from "../services/auth";
import {useNavigate} from "react-router-dom";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await registerUser(email, password, name, username);
            setSuccess(true);
        } catch {
            alert("Registration failed");
        }
    };
    if(success) {
        return (
            <div className="text-center mt-10">
                <h2 className="text-2xl font-bold text-green-600 mb-4">Registration successfully</h2>
                <p className="mb-4">Please login to continue</p>
                <button
                onClick={()=>navigate("/login")}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-950">
                    Go to Login Page
                </button>
            </div>
        )
    }

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
            <h2 className="text-2xl font-bold mb-4">Register</h2>
            <form onSubmit={handleRegister} className="space-y-4">
                <input
                    type="text"
                    placeholder="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-2 border rounded"
                />
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 border rounded"
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border rounded"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border rounded"
                />
                <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">
                    Register
                </button>
            </form>
        </div>
    );
};

export default Register;
