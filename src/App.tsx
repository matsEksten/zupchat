import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";

// pages & components
import LandingPage from "./pages/LandingPage";
import LobbyPage from "./pages/LobbyPage";
import LoginPage from "./pages/LoginPage";
import Navbar from "./components/Navbar";
import { ProfilePage } from "./pages/ProfilePage";
import SignupPage from "./pages/SignupPage";
import ChatRoomPage from "./pages/ChatRoomPage";

function App() {
  const location = useLocation();
  const isLanding = location.pathname === "/";
  const { user } = useAuthContext();
  return (
    <div
      className={
        isLanding
          ? "min-h-screen bg-linear-to-br from-black to-blue-800 flex flex-col"
          : "min-h-screen flex flex-col"
      }
    >
      <Navbar />
      <main>
        <Routes>
          <Route
            path="/"
            element={user ? <Navigate to="/lobby" /> : <LandingPage />}
          />
          <Route
            path="/login"
            element={user ? <Navigate to="/lobby" /> : <LoginPage />}
          />
          <Route
            path="/signup"
            element={user ? <Navigate to="/profile" /> : <SignupPage />}
          />
          <Route
            path="/profile"
            element={!user ? <Navigate to="/" /> : <ProfilePage />}
          />
          <Route
            path="/lobby"
            element={!user ? <Navigate to="/" /> : <LobbyPage />}
          />
          <Route
            path="/rooms/:roomId"
            element={!user ? <Navigate to="/" /> : <ChatRoomPage />}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
