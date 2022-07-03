import React, { useState, useEffect, useContext } from "react";
import Nav from "../components/navbar";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Mouse from "../assets/mouse.png";
import Trash from "../assets/trash.svg";
import { API } from "../config/api";
import convertRupiah from "rupiah-format";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const [product, setProduct] = useState([]);
  const [total, setTotal] = useState(0);
  let navigate = useNavigate();

  const getProductCart = async () => {
    try {
      const response = await API.get("/cart");
      setProduct(response.data.data);
      // console.log(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const increaseCart = async (idProduct) => {
    // e.preventDefault();

    try {
      const result = product.find(({ id }) => id == idProduct);
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const body = JSON.stringify({ qty: result.qty + 1 });
      const response = await API.patch("/cart/" + idProduct, body, config);
      console.log(result.qty++);
      getProductCart();
    } catch (error) {
      console.log(error);
    }
  };

  const decreaseCart = async (idProduct) => {
    // e.preventDefault();

    try {
      const result = product.find(({ id }) => id == idProduct);
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const body = JSON.stringify({ qty: result.qty - 1 });
      const response = await API.patch("/cart/" + idProduct, body, config);
      console.log(result.qty--);
      getProductCart();
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddTransaction = (e) => {
    // e.preventDefault();
    let price = parseInt(e.target.value);
    const checked = e.target.checked;

    // console.log(checked);
    // console.log(price);
    // if (!total) {
    // setTotal(price);
    // } else {
    // setTotal(total + price);
    // }
    // console.log(total);

    if (checked) {
      // let total += e.target.value
      // if (!total) {
      setTotal(parseInt(total + price));
    } else {
      setTotal(parseInt(total - price));
    }
    // }
    console.log(total);
    // else {
    //   let newCategoryId = categoryId.filter((categoryIdItem) => {
    //     return categoryIdItem != id;
    //   });
    //   setCategoryId(newCategoryId);
    // }
  };

  const deleteById = async (id) => {
    try {
      await API.delete(`/cart/${id}`);
      getProductCart();
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getProductCart();
    console.log(total);
  }, []);

  const handleBuy = async (item) => {
    try {
      // e.preventDefault();

      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      console.log(item.id, item.qty, item.price);
      let data = {
        id: item.id,
        qty: item.qty,
        price: item.price,
      };
      const body = JSON.stringify(data);
      const response = await API.post(`/transaction/${item.id}`, body, config);
      console.log(response);

      const token = response.data.payment.token;

      // Init Snap for display payment page with token here ...
      window.snap.pay(token, {
        onSuccess: function (result) {
          /* You may add your own implementation here */
          console.log(result);
          navigate("/profile");
        },
        onPending: function (result) {
          /* You may add your own implementation here */
          console.log(result);
          navigate("/profile");
        },
        onError: function (result) {
          /* You may add your own implementation here */
          console.log(result);
        },
        onClose: function () {
          /* You may add your own implementation here */
          API.delete(`/transaction/${response.data.id}`);
          alert("you closed the popup without finishing the payment");
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ backgroundColor: "#0B0B0B" }} className="vh-100">
      <Nav />
      <Container className="my-5 cart-container">
        <Row>
          <Col md={12}>
            <div className="text-rest mb-1 mt-4">Your Cart Order</div>
          </Col>
          <Col md={7}>
            {/* <div className="line-cart mb-2 mt-2"></div> */}
            {product.length !== 0 ? (
              <div>
                {product?.map((item, index) => (
                  <div
                    style={{ backgroundColor: "#262626" }}
                    className="mt-2 me-3"
                  >
                    <Row className="px-3 py-2">
                      <Col xs={2} className="">
                        <img
                          src={item.product.image}
                          className="img-carts bg-light mt-2 rounded"
                        />
                      </Col>
                      <Col xs={6}>
                        <div className="playfair text-nama-menu-cart mt-1">
                          {item.product.name}
                        </div>
                        <div className="mt-2">
                          {/* {item.qty > 1 &&
                                                <FontAwesomeIcon icon={faMinus} onClick={() => DecOrder(item)} className="text-rest icon-click" />
                                            } */}
                          <span
                            style={{ cursor: "pointer" }}
                            onClick={() => increaseCart(item.id)}
                          >
                            +
                          </span>
                          <span className="cart-qty text-danger me-3 ms-3">
                            {item.qty}
                          </span>
                          <span
                            style={{ cursor: "pointer" }}
                            onClick={() => decreaseCart(item.id)}
                          >
                            -
                          </span>
                        </div>
                      </Col>
                      <Col xs={4}>
                        <div className="text-danger text-right mt-2">
                          <div className="text-center">
                            {convertRupiah.convert(
                              item.qty * item.product.price
                            )}
                          </div>
                          <div
                            className="mb-2 mt-1 text-center"
                            style={{ cursor: "pointer" }}
                            onClick={() => deleteById(item.id)}
                          >
                            <img
                              style={{
                                width: "16px",
                                height: "20px",
                                backgroundColor: "whitesmoke",
                              }}
                              src={Trash}
                            />
                          </div>
                          {/* <label key={index} className="checkbox-inline me-4">
                            <input
                              type="checkbox"
                              value={item.qty * item.product.price}
                              onClick={handleAddTransaction}
                            />{" "}
                            {item.name}
                          </label> */}
                          <div className="text-center">
                            <button
                              onClick={() =>
                                handleBuy({
                                  id: item.idProduct,
                                  qty: item.qty,
                                  price: item.qty * item.product.price,
                                })
                              }
                              className="btn btn-buy text-center  btn-secondary px-3 "
                            >
                              Buy
                            </button>
                          </div>
                        </div>
                      </Col>
                    </Row>
                    <div className="line-cart my-2"></div>
                  </div>
                ))}
              </div>
            ) : (
              <Col>
                <div className="text-center pt-5">
                  <div className="mt-3">No data product</div>
                </div>
              </Col>
            )}

            {/* <pre>{JSON.stringify(stateCartDetail.restaurant.fullname, null, 2)}</pre> */}
          </Col>
        </Row>
      </Container>
    </div>
  );
}
