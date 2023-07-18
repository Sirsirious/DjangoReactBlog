import React, { useEffect, useState } from "react";
import PostForm from "../components/PostForm";
import PostsList from "../components/PostsList";
import { makeStyles } from "@material-ui/core";
import useAuth from "../utils/useAuth";
import { useParams } from "react-router-dom";
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
