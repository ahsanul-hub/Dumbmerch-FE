import React, { useContext, useState } from "react";
import { UserContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import { Alert } from "react-bootstrap";

import { API, setAuthToken } from "../config/api";
// import { UserContext } from "./context/userContext";

export default function LoginCard() {
  let navigate = useNavigate();
  const [message, setMessage] = useState(null);

  const [state, dispatch] = useContext(UserContext);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const { email, password } = form;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const body = JSON.stringify(form);

      const response = await API.post("/login", body, config);
      // console.log(response.data.data.user.token)
      setAuthToken(response.data.data.user.token);

      // Checking process
      if (response?.status == 200) {
        // Send data to useContext
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: response.data.data.user,
        });

        // Status check
        if (response.data.data.user.status == "admin") {
          navigate("/list-product");
        } else {
          navigate("/product");
        }

        const alert = (
          <Alert variant="success" className="py-1">
            Login success
          </Alert>
        );
        setMessage(alert);
      }
    } catch (error) {
      const alert = (
        <Alert variant="danger" className="py-1">
          Login failed
        </Alert>
      );
      setMessage(alert);
      console.log(error);
    }
  };
  return (
    <div className="login-container">
      <p className="login-title">Login</p>
      <form onSubmit={handleSubmit}>
        <div className="mt-3 form">
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={email}
            onChange={handleChange}
            className=" input-login px-3 py-2 mt-3"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={handleChange}
            name="password"
            className="input-login px-3 py-2 mt-3"
          />
        </div>
        <div className="d-grid gap-2 mt-5">
          <button className="btn-login">Login</button>
        </div>
      </form>
    </div>
  );
}
