import React from "react";

import { makeStyles } from "@material-ui/core";

import UserBlogList from "../components/UserBlogList";

const useStyles = makeStyles(() => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
}));

const UserBlogListPage = () => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <h1>Existing Blogs</h1>
      <UserBlogList />
    </div>
  );
};

export default UserBlogListPage;
