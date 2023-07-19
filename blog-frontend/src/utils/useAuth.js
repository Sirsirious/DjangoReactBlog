import { useState, useEffect, useMemo } from "react";
const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    const refreshAccessToken = async () => {
      const refreshToken = localStorage.getItem("refresh_token");

      const response = await fetch("http://localhost:8000/api/refresh-token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("access_token", data.access);
      }
    };
    const checkTokenValidity = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/check-token/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error(error);
        setIsAuthenticated(false);
      }
    };

    // Call the function once immediately when the component mounts
    if (token) {
      checkTokenValidity();
    }

    // Then, set up an interval to call the function every 60 seconds
    const validityCheckIntervalId = setInterval(() => {
      if (token) {
        checkTokenValidity();
      }
    }, 60000); // 60000 milliseconds = 60 seconds

    const refreshTokenIntervalId = setInterval(
      () => {
        refreshAccessToken();
      },
      55 * 60 * 1000,
    ); // 55 minutes

    // Clear the interval when the component unmounts
    return () => {
      clearInterval(validityCheckIntervalId);
      clearInterval(refreshTokenIntervalId);
    };
  }, []); // Pass an empty dependency array to ensure the effect runs only once on mount and not on updates

  // Memoize the authentication status
  const memoizedIsAuthenticated = useMemo(
    () => isAuthenticated,
    [isAuthenticated],
  );

  return memoizedIsAuthenticated;
};

export default useAuth;
