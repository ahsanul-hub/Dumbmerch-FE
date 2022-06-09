import React, { useContext, useState } from "react";
import { UserContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import { Alert } from "react-bootstrap";

import { API } from "../config/api";

export default function RegisterCard() {
  let navigate = useNavigate();
  const [message, setMessage] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { name, email, password } = form;

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

      const response = await API.post("/register", body, config);
      console.log(response);
    } catch (error) {
      const alert = (
        <Alert variant="danger" className="py-1">
          Failed
        </Alert>
      );
      setMessage(alert);
      console.log(error);
    }
  };
  return (
    <div className="login-container">
      <p className="login-title">Register</p>
      {message && message}
      <form onSubmit={handleSubmit}>
        <div className="mt-3 form">
          <input
            type="name"
            placeholder="Name"
            name="name"
            value={name}
            onChange={handleChange}
            className=" input-login px-3 py-2 mt-3"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleChange}
            name="email"
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
          <button className="btn-login">Register</button>
        </div>
      </form>
    </div>
  );
}
