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
  const isPublicAuth =
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/signup";
  const { user } = useAuthContext();

  return (
    <div
      className={
        isPublicAuth
          ? "min-h-screen flex flex-col relative bg-cover bg-no-repeat bg-[url('/backgrounds/landingpage/landing-mobile.webp')] lg:bg-[url('/backgrounds/landingpage/landing-desktop.webp')] md:bg-center"
          : "min-h-screen flex flex-col"
      }
    >
      {isPublicAuth && (
        <div className="pointer-events-none absolute inset-0 bg-black/40 lg:bg-black/25" />
      )}

      <div
        className={`h-dvh flex flex-col overflow-hidden ${
          isPublicAuth ? "relative z-10" : ""
        }`}
      >
        <Navbar />
        <main className="flex-1 overflow-hidden">
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
    </div>
  );
}

export default App;
