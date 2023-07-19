import React, { useState } from "react";
import { TextField, Button } from "@material-ui/core";

function CommentForm({ postId, onCommentPosted }) {
  const [content, setContent] = useState("");
  const token = localStorage.getItem("access_token");

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`http://localhost:8000/api/posts/${postId}/comments/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text: content, post: postId }),
    })
      .then((response) => {
        if (!response.ok) throw new Error(response.status);
        return response.json();
      })
      .then((data) => {
        onCommentPosted(data);
        setContent("");
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Leave a comment"
        fullWidth
        margin="normal"
      />
      <Button type="submit" variant="contained" color="primary">
        Post Comment
      </Button>
    </form>
  );
}

export default CommentForm;
