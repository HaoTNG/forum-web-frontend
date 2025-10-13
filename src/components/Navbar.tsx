import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../components/AuthContext";


const Avatar = ({ name, imageUrl }: { name?: string; imageUrl?: string | null }) => {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className="h-9 w-9 rounded-full object-cover"
      />
    );
  }
  const initial = (name?.trim()?.[0] || "?").toUpperCase();
  return (
    <div className="h-9 w-9 rounded-full bg-gray-300 flex items-center justify-center text-sm font-bold text-gray-700">
      {initial}
    </div>
  );
};

const Navbar = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();




  

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
    }
  };

  const loggedIn = !!user;

  return (
    <>
      {/* NAVBAR CHÍNH */}
      <nav className="sticky top-0 z-50 bg-[#122640] text-white p-1 shadow-md">
        
        <div className="flex justify-around items-center ">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center text-base sm:text-xl md:text-2xl lg:text-3xl font-bold"
          >
            <span>Zforum</span>
          </Link>

          {/* Search */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center justify-center w-full max-w-[800px]"
            >
            {/* Input chỉ hiện khi md trở lên */}
            <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="hidden md:flex flex-grow h-10 px-4 text-sm text-black bg-white border border-gray-300 rounded-l-full focus:outline-none focus:border-blue-500"
            />

            {/* Icon luôn hiện */}
            <button
                type="submit"
                className="h-10 w-10 flex items-center justify-center bg-gray-100 border border-gray-300 rounded-full md:rounded-r-full md:rounded-l-none hover:bg-gray-200"
            >
                <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 16 16"
                className="text-gray-600"
                >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                </svg>
            </button>
        </form>


          {/* Menu phải */}
          <div className="flex items-center">
            {loggedIn && (
              <Link
                to="/notifications"
                className="px-4 py-2 rounded-md hover:bg-[#1c4980] text-xs sm:text-sm md:text-base lg:text-lg"
              >
                Notifications
              </Link>
            )}

            {loggedIn && (
              <Link
                to="/chat"
                className="px-4 py-2 rounded-md hover:bg-[#1c4980] text-xs sm:text-sm md:text-base lg:text-lg"
              >
                Chat
              </Link>
            )}
            {loggedIn && (
              <Link
                to="/group"
                className="px-4 py-2 rounded-md hover:bg-[#1c4980] text-xs sm:text-sm md:text-base lg:text-lg"
              >
                Groups
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
                  className="px-4 py-2 rounded-md hover:bg-[#1c4980] text-xs sm:text-sm md:text-base lg:text-lg"
                >
                  Register
                </Link>
              </>
            ) : (
              <span className="flex items-center gap-2">
                

                <Link
                  to="/user/me"
                  className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-[#1c4980] text-xs sm:text-sm md:text-base lg:text-lg"
                >
                  <Avatar name={user?.username} imageUrl={user?.avatarUrl} />
                  <span>
                    {user?.username?.trim()
                      ? user.username.trim().length > 12
                        ? user.username.trim().slice(0, 12) + "..."
                        : user.username.trim()
                      : ""}
                  </span>
                </Link>
              </span>
            )}

            
          </div>
        </div>
        
      </nav>

    </>
  );
};

export default Navbar;
