import React, { useContext } from "react";
import Logo from "../assets/dumbMerch.png";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";

export default function NavbarAdmin() {
  let navigate = useNavigate();

  const [state, dispatch] = useContext(UserContext);

  const logout = () => {
    console.log(state);
    dispatch({
      type: "LOGOUT",
    });
    navigate("/");
  };
  return (
    <div className="nav-container">
      <img src={Logo} className="nav-logo" style={{ width: "70px" }} />

      <div className="nav-link-container">
        <Link to="/complain-admin" className="nav-link">
          Complain
        </Link>
        <Link to="/category" className="nav-link">
          Category
        </Link>
        <Link to="/list-product" className="nav-link">
          Product
        </Link>
        <Link to="/" onClick={logout} className="nav-link">
          Logout
        </Link>
      </div>
    </div>
  );
}
