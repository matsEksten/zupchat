import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";

export default function Navbar() {
  const location = useLocation();
  const path = location.pathname;

  const { logout, isPending } = useLogout();

  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const isChatRoute = path.startsWith("/rooms/");

  const menuOptions = () => {
    if (path === "/login") return <Link to="/signup">Sign up</Link>;
    if (path === "/signup") return <Link to="/login">Log in</Link>;
    if (path === "/lobby") return <Link to="/profile">Profile</Link>;
    if (path === "/profile") {
      return isPending ? (
        <button disabled>Logging out...</button>
      ) : (
        <button onClick={handleLogout}>Log out</button>
      );
    }
    if (isChatRoute) return <Link to="/lobby">Leave room</Link>;

    return null;
  };

  return (
    <header
      className={`
        sticky top-0 z-20
        ${
          isChatRoute
            ? "bg-black/70 border-dashed border-b-4 border-yellow-400"
            : ""
        }
      `}
    >
      <nav className="h-16 flex items-center justify-between px-2">
        {isChatRoute ? (
          <div>
            <img
              src="/images/ZupChatTextLogoWhite.png"
              className="h-12"
              alt="ZupChat logo"
            />
          </div>
        ) : (
          <Link to="/">
            <img
              src="/images/ZupChatTextLogoWhite.png"
              className="h-12"
              alt="ZupChat logo"
            />
          </Link>
        )}

        <div className="pr-2">{menuOptions()}</div>
      </nav>
    </header>
  );
}
