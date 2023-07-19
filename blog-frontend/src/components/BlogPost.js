import React from "react";

import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(4),
    width: "100%",
    maxWidth: 800,
    margin: "0 auto",
    padding: theme.spacing(2),
    backgroundColor: "#f5f5f5",
    borderRadius: theme.spacing(1),
  },
}));
function BlogPost({ post }) {
  const classes = useStyles();

  return (
    post && (
      <div className={classes.root}>
        <p>{post.content}</p>
      </div>
    )
  );
}

export default BlogPost;
