import './App.css'
import React from "react";

import AppRoutes from "./routes/AppRoutes.tsx";
import { AuthProvider } from "./components/AuthContext";
function App() {


  return (
  <React.StrictMode>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </React.StrictMode>

  )
}

export default App
