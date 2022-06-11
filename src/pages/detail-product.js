import React, { useState, useEffect, useContext } from "react";
import Nav from "../components/navbar";
import { Container, Row, Col, Alert, Button } from "react-bootstrap";
import Mouse from "../assets/mouse.png";
import { Link, useNavigate, useParams } from "react-router-dom";
import { API } from "../config/api";
import convertRupiah from "rupiah-format";

export default function Detail() {
  const [product, setProduct] = useState([]);
  const [message, setMessage] = useState(null);
  let navigate = useNavigate();

  const { id } = useParams();
  const getProduct = async () => {
    try {
      const response = await API.get("/product/" + id);
      setProduct(response.data.data);
      //   console.log(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddCart = async () => {
    try {
      // e.preventDefault();

      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      // let idProduct = id;
      const body = JSON.stringify({ idProduct: id });

      const response = await API.post("/cart", body, config);
      console.log(response);

      // Checking process
      if (response?.status == 200) {
        const alert = (
          <Alert variant="success" className="py-1">
            Add Cart success
          </Alert>
        );
        setMessage(alert);
        navigate("/cart");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProduct();

    const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
    //change this according to your client-key
    const myMidtransClientKey = "Client key here ...";

    let scriptTag = document.createElement("script");
    scriptTag.src = midtransScriptUrl;
    // optional if you want to set script attribute
    // for example snap.js have data-client-key attribute
    scriptTag.setAttribute("data-client-key", myMidtransClientKey);

    document.body.appendChild(scriptTag);
    return () => {
      document.body.removeChild(scriptTag);
    };
  }, []);

  const handleBuy = async () => {
    try {
      // e.preventDefault();

      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      let idProduct = id;
      const body = JSON.stringify({});
      const response = await API.post(
        "/transaction/" + idProduct,
        body,
        config
      );
      console.log(response);

      // Checking process
      // if (response?.status == 200) {
      //   const alert = (
      //     <Alert variant="success" className="py-1">
      //       Add Transaction success
      //     </Alert>
      //   );
      //   setMessage(alert);
      //   navigate("/profile");
      // }

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
    <div>
      <Nav />
      <div className="vh-100 detail-page">
        <Container>
          <Row>
            <Col sm="5">
              <img
                src={product.image}
                alt="img"
                className="img-fluid"
                style={{ height: "555px", width: "436px" }}
              />
            </Col>
            <Col sm="7" style={{ padding: "33px 40px" }}>
              <h1 className="product-name">{product.name}</h1>
              <p>Stock : {product.qty}</p>

              <p className="product-spec">{product.desc}</p>
              <p className="detail-price">
                {convertRupiah.convert(product.price)}
              </p>
              <Button
                type="submit"
                style={{ width: "48%" }}
                variant="success"
                className="btn-action btn-delete"
                onClick={handleBuy}
              >
                Buy
              </Button>
              <Button
                type="submit"
                style={{ width: "48%", float: "right" }}
                variant="success"
                className="btn-action btn-dark"
                onClick={handleAddCart}
              >
                Masukan Keranjang
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}
