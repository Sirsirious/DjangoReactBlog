import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core";
import useAuth from "../utils/useAuth";
import { useParams } from "react-router-dom";
import BlogPost from "../components/BlogPost";
import CommentForm from "../components/CommentForm";

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
  const [comments, setComments] = useState([]);
  const classes = useStyles();
  const isAuthenticated = useAuth();

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

  // useEffect(() => {
  //   const fetchComments = async () => {
  //     try {
  //       const response = await fetch(
  //         `http://localhost:8000/api/posts/${id}/comments/`,
  //       );
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch comments.");
  //       }
  //       const data = await response.json();
  //       setComments(data);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };
  //
  //   fetchComments();
  // }, [id]);

  useEffect(() => {
    const socket = new WebSocket(
      `ws://localhost:8000/ws/posts/${id}/comments/`,
    );

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setComments((prevComments) => [...prevComments, data]);
    };

    return () => {
      socket.close();
    };
  }, []);

  const onCommentSubmit = (comment) => {
    setComments([...comments, comment]);
  };

  if (!post) return "Loading...";

  console.log(post);

  return (
    <div className={classes.container}>
      <h1>{post.title}</h1>
      <BlogPost post={post} />
      <h2>Comments</h2>
      {comments &&
        comments.map((comment) => (
          <p>
            {comment.content} by {comment.author}
          </p>
        ))}
      {isAuthenticated && (
        <CommentForm postId={post.id} onCommentPosted={onCommentSubmit} />
      )}
    </div>
  );
};

export default BlogPostPage;
