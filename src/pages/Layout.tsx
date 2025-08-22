import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Layout = () => {
    return (
        <div className="flex flex-col min-h-screen bg-[#0c1017] ">
            <Navbar />
            <main className="flex-1   ">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}

export default Layout;