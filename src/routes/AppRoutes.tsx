import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "../pages/Layout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import PostDetail from "../pages/PostDetail.tsx";
import CreatePost from "../pages/PostCreate.tsx";
import EditPost from "../pages/EditPost";
import ProfilePage from "../pages/ProfilePage";
import UserManagement from "../pages/UserManagement.tsx";
import SearchResults from "../pages/SearchResults.tsx";
import UserProfile from "../pages/UserProfile.tsx";
const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home/>}/>
                    <Route path="login" element={<Login/>}/>
                    <Route path="register" element={<Register/>}/>
                    <Route path="post/:id" element={<PostDetail/>}/>
                    <Route path="create" element={<CreatePost/>}/>
                    <Route path="edit/:id" element={<EditPost/>}/>
                    <Route path="user/me" element={<ProfilePage/>}/>
                    <Route path="user" element={<UserProfile/>}/>
                    <Route path="modandadmin" element={<UserManagement/>}/>
                    <Route path="search" element={<SearchResults />}/>
                </Route>
            </Routes>
        </Router>
    )
}

export default AppRoutes;