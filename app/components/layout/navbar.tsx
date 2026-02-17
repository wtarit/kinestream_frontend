import { Link, useLocation } from "react-router";
import { FiFilm, FiUpload, FiVideo } from "react-icons/fi";

export function Navbar() {
  const location = useLocation();

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <div className="navbar bg-base-200 border-b border-base-300 px-4">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl text-primary font-bold gap-2">
          <FiFilm className="text-2xl" />
          KineStream
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal gap-1">
          <li>
            <Link
              to="/"
              className={isActive("/") && !location.pathname.startsWith("/upload") ? "active" : ""}
            >
              <FiVideo />
              Videos
            </Link>
          </li>
          <li>
            <Link
              to="/upload"
              className={isActive("/upload") ? "active" : ""}
            >
              <FiUpload />
              Upload
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
