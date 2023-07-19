import React from "react";

import AuthProvider from "./utils/AuthProvider";
import AppRouter from "./Routes";

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
