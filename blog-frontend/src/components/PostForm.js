import React, { useState } from "react";
import { TextField, Button, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(4),
  },
  form: {
    width: "100%",
    maxWidth: 800,
    margin: "0 auto",
    padding: theme.spacing(2),
    backgroundColor: "#f5f5f5",
    borderRadius: theme.spacing(1),
  },
}));
function PostForm({ onAddPost }) {
  const classes = useStyles();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const post = { title, content };
    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch("http://localhost:8000/api/posts/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(post),
      });

      if (!response.ok) {
        throw new Error("Post was not successful");
      }
      const postResponse = await response.json();
      onAddPost(postResponse);

      setTitle("");
      setContent("");
      setError(false);
    } catch (error) {
      setError(true);
    }
  };

  return (
    <div className={classes.root}>
      <form
        className={classes.form}
        onSubmit={handleSubmit}
        noValidate
        autoComplete="off"
      >
        <TextField
          error={error}
          id="title"
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          error={error}
          id="content"
          label="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          fullWidth
          multiline
          rows={4}
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">
          Add Post
        </Button>
      </form>
    </div>
  );
}

export default PostForm;
