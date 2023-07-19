import React, { useState, useEffect, useCallback } from "react";
import { makeStyles, Card, CardContent } from "@material-ui/core";
import { Link } from "react-router-dom";
import { debounce } from "lodash";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: "300px",
    margin: theme.spacing(2),
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    cursor: "pointer",
    alignItems: "center",
    textDecoration: "none",
    color: "inherit",
    "&:hover": {
      backgroundColor: theme.palette.primary.light,
    },
  },
}));

const UserBlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");

  const classes = useStyles();

  const fetchBlogs = (searchString) => {
    fetch(`http://localhost:8000/api/userblogs/?search=${searchString}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => setBlogs(data));
  };

  const debouncedFetch = useCallback(
    debounce((search) => fetchBlogs(search), 600),
    [],
  );

  useEffect(() => {
    debouncedFetch(search);
  }, [search]);

  return (
    <div className={classes.container}>
      <input
        type="text"
        placeholder="Search for blogs..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {blogs &&
        blogs.map((blog) => (
          <Link
            to={`/users/${blog.id}/posts`}
            key={blog.id}
            className={classes.card}
          >
            <Card>
              <CardContent>
                <h2>{blog.username}</h2>
                <p>Total posts: {blog.total_posts}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
    </div>
  );
};

export default UserBlogList;
