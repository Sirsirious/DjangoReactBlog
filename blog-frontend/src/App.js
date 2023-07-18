import React from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import NavBar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import BlogPage from "./pages/BlogPage";
import UserRegisterPage from "./pages/UserRegisterPage";
import useAuth from "./utils/useAuth";
import UserLoginPage from "./pages/UserLoginPage";
import UserBlogListPage from "./pages/UserBlogListPage";
import BlogPostPage from "./pages/BlogPostPage";

function App() {
  const isAuthenticated = useAuth();
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
}

export default App;
