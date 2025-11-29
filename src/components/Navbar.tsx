import { Link, useLocation } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const path = location.pathname;

  const { user } = useAuthContext();

  const { logout, isPending, error } = useLogout();

  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

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

    return null;
  };

  return (
    <header>
      <nav className="h-16 flex items-center justify-between px-2">
        <Link to="/">
          <img
            src="/images/ZupChatTextLogoWhite.png"
            className="h-12"
            alt="ZupChat logo"
          />
        </Link>

        <div className="pr-2">{menuOptions()}</div>
      </nav>
    </header>
  );
}
