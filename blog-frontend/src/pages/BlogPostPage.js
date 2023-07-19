import React, { useEffect, useState, useReducer, useContext } from "react";
import { makeStyles } from "@material-ui/core";
import { useParams } from "react-router-dom";
import BlogPost from "../components/BlogPost";
import CommentForm from "../components/CommentForm";
import Comment from "../components/Comment";
import AuthContext from "../utils/AuthContext";

const useStyles = makeStyles(() => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
}));

const commentReducer = (state, action) => {
  if (action.comment.length === 0) return state;
  if (action.type === "added") {
    if (action.comment.id in state) return state;
    return { ...state, [action.comment.id]: action.comment };
  } else if (action.type === "updated") {
    return { ...state, [action.comment.id]: action.comment };
  } else if (action.type === "deleted") {
    const newState = { ...state };
    delete newState[action.comment.id];
    return newState;
  }
  return state;
};

const BlogPostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, reduceComments] = useReducer(commentReducer, {});
  const classes = useStyles();
  const isAuthenticated = useContext(AuthContext);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/posts/${id}/`);
        if (!response.ok) {
          throw new Error("Failed to fetch post.");
        }
        const data = await response.json();
        setPost(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPost();
  }, [id]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/posts/${id}/comments/`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch comments.");
        }
        const comments = await response.json();
        for (const comment of comments) {
          reduceComments({ type: "added", comment });
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchComments();
  }, [id]);

  useEffect(() => {
    const socket = new WebSocket(
      `ws://localhost:8000/ws/posts/${id}/comments/`,
    );

    socket.onmessage = (event) => {
      const comment = JSON.parse(event.data);
      reduceComments({ type: "added", comment });
    };

    return () => {
      socket.close();
    };
  }, []);

  const onCommentSubmit = (comment) => {
    reduceComments({ type: "added", comment });
  };

  if (!post) return "Loading...";

  return (
    <div className={classes.container}>
      <h1>{post.title}</h1>
      <BlogPost post={post} />
      <h2>Comments</h2>
      {comments &&
        Object.values(comments).map((comment, index) => (
          <Comment key={comment.id} comment={comment} index={index} />
        ))}
      {isAuthenticated && (
        <CommentForm postId={id} onCommentPosted={onCommentSubmit} />
      )}
    </div>
  );
};

export default BlogPostPage;
