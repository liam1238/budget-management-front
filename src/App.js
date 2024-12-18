import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/Routes"; // Import your routes component

const App = () => {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

export default App;
