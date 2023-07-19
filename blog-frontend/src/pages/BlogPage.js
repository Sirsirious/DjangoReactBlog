import React, { useContext, useEffect, useState } from "react";
import PostForm from "../components/PostForm";
import PostsList from "../components/PostsList";
import { makeStyles } from "@material-ui/core";
import { useParams } from "react-router-dom";
import AuthContext from "../utils/AuthContext";

const useStyles = makeStyles(() => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
}));

const BlogPage = () => {
  const { userId } = useParams();
  const [posts, setPosts] = useState([]);

  const classes = useStyles();
  const isAuthenticated = useContext(AuthContext);

  useEffect(() => {
    fetch(`http://localhost:8000/api/posts/user/${userId}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => setPosts(data))
      .catch((error) => console.error("Error:", error));
  }, [userId]);

  const addPost = (post) => {
    setPosts((prevPosts) => [...prevPosts, post]);
  };

  return (
    <div className={classes.container}>
      <h1>Blog</h1>
      <PostsList posts={posts} />
      {isAuthenticated && <PostForm onAddPost={addPost} />}
    </div>
  );
};

export default BlogPage;
