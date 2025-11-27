import { Routes, Route, useLocation } from "react-router-dom";

// pages & components
import LandingPage from "./pages/LandingPage";
import LobbyPage from "./pages/LobbyPage";
import LoginPage from "./pages/LoginPage";
import Navbar from "./components/Navbar";
import SignupPage from "./pages/SignupPage";

function App() {
  const location = useLocation();
  const isLanding = location.pathname === "/";
  return (
    <div
      className={
        isLanding
          ? "min-h-screen bg-linear-to-br from-black to-blue-800"
          : "" + "min-h-screen flex flex-col"
      }
    >
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/lobby" element={<LobbyPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
