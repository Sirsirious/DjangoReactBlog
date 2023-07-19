import React, { useEffect, useState, useReducer, useContext } from "react";
import { makeStyles } from "@material-ui/core";
import { useParams } from "react-router-dom";
import BlogPost from "../components/BlogPost";
import CommentForm from "../components/CommentForm";
import Comment from "../components/Comment";
import AuthContext from "../utils/AuthContext";
import commentTreeReducer from "../shared/commentReducer";

const useStyles = makeStyles(() => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
}));

const BlogPostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, dispatchComments] = useReducer(commentTreeReducer, {
    commentMap: {},
    commentTree: [],
  });
  const { commentMap, commentTree } = comments;

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
          dispatchComments({
            type: "added",
            comment: { ...comment, replies: [] },
          });
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
      dispatchComments({ type: "added", comment: { ...comment, replies: [] } });
    };

    return () => {
      socket.close();
    };
  }, []);

  const onCommentSubmit = (comment) => {
    dispatchComments({ type: "added", comment: { ...comment, replies: [] } });
  };

  const renderComments = (comments, depth = 0) => {
    return comments.map((comment, index) => (
      <div
        style={
          depth > 0 ? { marginLeft: `${depth * 20}px` } : { marginLeft: "0px" }
        }
        key={comment.id}
      >
        <Comment comment={comment} index={index} />
        {comment.replies && renderComments(comment.replies, depth + 1)}
      </div>
    ));
  };

  if (!post) return "Loading...";

  return (
    <div className={classes.container}>
      <h1>{post.title}</h1>
      <BlogPost post={post} />
      <h2>Comments</h2>
      <div>{commentTree && renderComments(commentTree)}</div>
      {isAuthenticated && (
        <CommentForm postId={id} onCommentPosted={onCommentSubmit} />
      )}
    </div>
  );
};

export default BlogPostPage;
