import React, { useContext } from "react";
import { Link as RouterLink } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button } from "@material-ui/core";
import AuthContext from "../utils/AuthContext";

const NavBar = () => {
  const isAuthenticated = useContext(AuthContext);
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/login";
  };
  return (
    <AppBar position="static">
      <Toolbar>
        {isAuthenticated ? (
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
