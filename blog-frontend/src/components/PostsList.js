import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core";
import { ISODateToDate } from "../utils/dates";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(4),
    width: "100%",
    maxWidth: 800,
    margin: "0 auto",
    padding: theme.spacing(2),
    borderRadius: theme.spacing(3),
  },
  link: {
    textDecoration: "none",
    color: "inherit",
  },
  card: {
    width: "500px",
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    cursor: "pointer",
    textDecoration: "none",
    alignItems: "center",
    margin: "0 auto",
    color: "inherit",
    "&:hover": {
      backgroundColor: theme.palette.primary.light,
    },
  },
}));

function PostsList({ posts }) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      {posts &&
        posts.map((post) => (
          <Link to={`/blog/${post.id}`} className={classes.link}>
            <div key={post.id} className={classes.card}>
              <h2>{post.title}</h2>
              <p>{post.truncated_content}</p>
              <p>Created at {ISODateToDate(post.created_at)}</p>
            </div>
          </Link>
        ))}
    </div>
  );
}

export default PostsList;
