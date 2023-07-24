import React, { useState } from "react";
import { TextField, Button } from "@material-ui/core";

function CommentForm({ postId, onCommentPosted, replyToId, closeForm }) {
  const [content, setContent] = useState("");
  const token = localStorage.getItem("access_token");

  const handleSubmit = (e) => {
    e.preventDefault();

    const commentData = { text: content, post: postId };
    if (replyToId) commentData["in_reply_to"] = replyToId;

    fetch(`http://localhost:8000/api/posts/${postId}/comments/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(commentData),
    })
      .then((response) => {
        if (!response.ok) throw new Error(response.status);
        return response.json();
      })
      .then((data) => {
        onCommentPosted();
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
      {replyToId && (
        <Button type="button" onClick={closeForm}>
          Close
        </Button>
      )}
    </form>
  );
}

export default CommentForm;
