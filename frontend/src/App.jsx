import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Browse from "./pages/Browse";
import History from "./pages/History";
import Recommendations from "./pages/Recommendations";
import Provider from "./pages/Provider";
import Preferences from "./pages/Preferences";

const isAuthenticated = () => {
  return localStorage.getItem("token");
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing */}
        <Route path="/" element={<Landing />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/preferences"
          element={isAuthenticated() ? <Preferences /> : <Navigate to="/login" />}
        />
        <Route
          path="/browse"
          element={isAuthenticated() ? <Browse /> : <Navigate to="/login" />}
        />
        <Route
          path="/history"
          element={isAuthenticated() ? <History /> : <Navigate to="/login" />}
        />
        <Route
          path="/recommendations"
          element={
            isAuthenticated() ? (
              <Recommendations
                initialResults={
                  (() => {
                    try {
                      return JSON.parse(
                        localStorage.getItem("last_recommendations") || "[]"
                      );
                    } catch {
                      return [];
                    }
                  })()
                }
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/provider/:name"
          element={isAuthenticated() ? <Provider /> : <Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

