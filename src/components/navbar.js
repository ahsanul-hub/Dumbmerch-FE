import React, { useContext } from "react";
import Logo from "../assets/dumbMerch.png";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";

export default function Nav() {
  let navigate = useNavigate();

  const [state, dispatch] = useContext(UserContext);
  const [stateUserLogin, dispatchUserLogin] = useContext(UserContext);

  const logout = () => {
    console.log(state);
    dispatch({
      type: "LOGOUT",
    });
    navigate("/");
  };

  return (
    <div className="nav-container">
      <Link to="/product">
        <img src={Logo} className="nav-logo" style={{ width: "70px" }} />
      </Link>

      <div className="nav-link-container">
        <Link to="/complain" className="nav-link">
          Complain
        </Link>
        <Link to="/profile" className="nav-link">
          Profile
        </Link>
        <Link to="/cart" className="nav-link">
          Keranjang
        </Link>
        <Link to="/" onClick={logout} className="nav-link">
          Logout
        </Link>
      </div>
    </div>
  );
}
