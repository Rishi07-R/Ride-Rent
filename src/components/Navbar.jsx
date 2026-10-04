import { Link } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo">
          RideRent
        </Link>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/vehicles">Vehicles</Link>
          <Link to="/my-bookings">My Bookings</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;