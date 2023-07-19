import React from "react";
import useAuth from "./useAuth";
import AuthContext from "./AuthContext";

const AuthProvider = ({ children }) => {
  const isAuthenticated = useAuth();

  return (
    <AuthContext.Provider value={isAuthenticated}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
