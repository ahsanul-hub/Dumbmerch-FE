import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Nav from "../components/navbar";
import { API } from "../config/api";
import { Link, useNavigate } from "react-router-dom";
import convertRupiah from "rupiah-format";

export default function Product() {
  const [products, setProduct] = useState([]);

  const getProducts = async () => {
    try {
      const response = await API.get("/products");
      setProduct(response.data.data.products);
      // console.log(response.data.data.products);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div>
      <Nav />
      <div className="page-product vh-100">
        <h1 className="header-product">Product</h1>
        {products.length !== 0 ? (
          <div>
            {products?.map((item, index) => (
              <Link
                to={`/detail-product/${item.id}`}
                className="product-container"
              >
                <img
                  src={item.image}
                  className=""
                  style={{ width: "241px", height: "312px" }}
                />
                <div className="desc-product">
                  <h2 className="product-title">{item.name}</h2>
                  <p> {convertRupiah.convert(item.price)}</p>
                  <p>Stock : {item.qty}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <Col>
            <div className="text-center pt-5">
              <div className="mt-3">No data product</div>
            </div>
          </Col>
        )}
        {/* {products.length !== 0 ? (
           {products?.map((item, index) => (
                
              ))}
        <div className="product-container">
          <img
            src={Mouse}
            className=""
            style={{ width: "241px", height: "312px" }}
          />
          <div className="desc-product">
            <h2 className="product-title">Mouse</h2>
            <p>Rp 500.000,00</p>
            <p>Stock : 200</p>
          </div>
        </div>
         ):(
           <div>

           </div>
         )} */}
        {/* <div className="product-container">
          <img
            src={Mouse}
            className=""
            style={{ width: "241px", height: "312px" }}
          />
          <div className="desc-product">
            <h2 className="product-title">Mouse</h2>
            <p>Rp 500.000,00</p>
            <p>Stock : 200</p>
          </div>
        </div> */}
      </div>
    </div>
  );
}
