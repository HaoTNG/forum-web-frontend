import {loginUser} from "../services/auth.ts";
import {useState} from "react";
import {useNavigate} from "react-router-dom";

const Login = () =>{
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try{
            const data = await loginUser(email, password);
            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("refreshToken", data.refreshToken);
            localStorage.setItem("username", data.user.username);
            localStorage.setItem("userid", data.user.id);
            window.location.href = "/";
        }catch{
            alert("login failed");
        }
    }

    if(success){



    }
    return(
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded">
            <h2 className="text-2xl font-bold mb-4">Login</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border rounded"/>
                    <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border rounded"/>
                    <button type="submit" className="w-full bg-blue-600 text-white rounded">
                        Login
                    </button>
                </form>
        </div>
    )
}

export default Login;