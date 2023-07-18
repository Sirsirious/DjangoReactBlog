import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button } from "@material-ui/core";

const NavBar = () => {
  const isLoggedIn = !!localStorage.getItem("access_token");
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    // Here you may want to add a redirection to the login page, like so:
    window.location.href = "/login";
  };
  return (
    <AppBar position="static">
      <Toolbar>
        {isLoggedIn ? (
          <>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              My Blog
            </Typography>
            <Button color="inherit" component={RouterLink} to="/">
              Home
            </Button>
            <Button color="inherit" component={RouterLink} to="/userblogs">
              Blogs
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              {" "}
              Logout{" "}
            </Button>
          </>
        ) : (
          <>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              My Blog
            </Typography>
            <Button color="inherit" component={RouterLink} to="/userblogs">
              Blogs
            </Button>
            <Button color="inherit" component={RouterLink} to="/login">
              Login
            </Button>
            <Button color="inherit" component={RouterLink} to="/register">
              Register
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
