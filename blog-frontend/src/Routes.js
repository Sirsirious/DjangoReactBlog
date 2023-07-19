import NavBar from "./components/Navbar";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import UserRegisterPage from "./pages/UserRegisterPage";
import UserLoginPage from "./pages/UserLoginPage";
import UserBlogListPage from "./pages/UserBlogListPage";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import React, { useContext } from "react";
import AuthContext from "./utils/AuthContext";

const AppRouter = () => {
  const isAuthenticated = useContext(AuthContext);
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/" /> : <UserRegisterPage />}
        />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" /> : <UserLoginPage />}
        />
        <Route path="/userblogs" element={<UserBlogListPage />} />
        <Route path="/users/:userId/posts" element={<BlogPage />} />
        <Route path="/blog/:id" element={<BlogPostPage />} />
        {/*<Route path="/blog" element={<BlogPage />} />*/}
      </Routes>
    </Router>
  );
};

export default AppRouter;
