import { Route, Routes } from "react-router-dom";
import Landing from "./pages/landing";
import { UserContext } from "./context/userContext";
import Product from "./pages/product";
import Profile from "./pages/profile";
import Detail from "./pages/detail-product";
import Listproduct from "./pages/listproduct";
import Category from "./pages/category-list";
import Editproduct from "./pages/edit-product";
import Addproduct from "./pages/add-product";
import Editcategory from "./pages/edit-category";
import Addcategory from "./pages/add-category";
import Complain from "./pages/complain.js";
import ComplainAdmin from "./pages/complainAdmin.js";
import Cart from "./pages/cart.js";
import { useContext, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { API, setAuthToken } from "./config/api";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}
function App() {
  const navigate = useNavigate();
  const [state, dispatch] = useContext(UserContext);
  // console.log(state);
  // if (localStorage.token) {
  //   setAuthToken(localStorage.token);
  // }

  useEffect(() => {
    // Redirect Auth
    if (!state.isLogin) {
      navigate("/");
    } else {
      if (state.user.status === "admin") {
        navigate("/list-product");
      } else if (state.user.status === "customer") {
        navigate("/product");
      }
    }
  }, [state]);

  const checkUser = async () => {
    try {
      const response = await API.get("/check-auth");

      // If the token incorrect
      if (response.status === 404) {
        return dispatch({
          type: "AUTH_ERROR",
        });
        // navigate("/");
      }

      // Get user data
      let payload = response.data.data.user;
      // Get token from local storage
      payload.token = localStorage.token;
      // console.log(payload);
      // Send data to useContext
      dispatch({
        type: "USER_SUCCESS",
        payload,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // if (localStorage.token) {
    checkUser();
    // }
  }, []);

  return (
    <Routes>
      <Route path="/product" element={<Product />} />
      <Route path="/" element={<Landing />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/detail-product/:id" element={<Detail />} />
      <Route path="/list-product" element={<Listproduct />} />
      <Route path="/category" element={<Category />} />
      <Route path="/add-product" element={<Addproduct />} />
      <Route path="/edit-product/:id" element={<Editproduct />} />
      <Route path="/edit-category/:id" element={<Editcategory />} />
      <Route path="/add-category" element={<Addcategory />} />
      <Route path="/complain" element={<Complain />} />
      <Route path="/complain-admin" element={<ComplainAdmin />} />
      <Route path="/cart" element={<Cart />} />
    </Routes>
  );
}

export default App;
