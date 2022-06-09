import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Button } from "react-bootstrap";
import NavbarAdmin from "../components/navbaradmin";
import DeleteModal from "../components/deleteModal";
import { API } from "../config/api";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function Listproduct() {
  const [products, setProduct] = useState([]);
  const [idDelete, setIdDelete] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const getProducts = async () => {
    try {
      const response = await API.get("/products");
      setProduct(response.data.data.products);
      // console.log(response.data.data.products);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = (id) => {
    setIdDelete(id);
    handleShow();
  };

  const deleteById = async (id) => {
    try {
      await API.delete(`/product/${id}`);
      getProducts();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  useEffect(() => {
    if (confirmDelete) {
      // Close modal confirm delete data
      handleClose();
      // execute delete data by id function
      deleteById(idDelete);
      setConfirmDelete(null);
    }
  }, [confirmDelete]);

  return (
    <div>
      <NavbarAdmin />
      <div className="vh-100 list-page">
        <Container>
          <h1 className="mb-5 header-list-product">List Product</h1>
          <Link to="/add-product">
            <Button className="btn-dark btn-add-list">Add Product</Button>
          </Link>
          <Row>
            <Table striped hover variant="dark">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Photo</th>
                  <th>Product Name</th>
                  <th>Product Desc</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th style={{ maxWidth: "300px" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {products?.map((item, index) => (
                  <tr>
                    <td>{index + 1}</td>
                    <td>
                      <img
                        src={item.image}
                        className=""
                        style={{ width: "50px" }}
                      />
                    </td>
                    <td>{item.name}</td>
                    <td>{item.desc}</td>
                    <td>{item.price}</td>
                    <td>{item.qty}</td>
                    <td style={{ maxWidth: "190px" }}>
                      <Link to={`/edit-product/${item.id}`}>
                        <Button className="btn-action btn-edit me-3">
                          Edit
                        </Button>
                      </Link>
                      <Button
                        onClick={() => {
                          handleDelete(item.id);
                        }}
                        className="btn-action btn-delete"
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}

                {/* <tr>
                  <td>1</td>
                  <td>Mouse.jpg</td>
                  <td>Mouse</td>
                  <td>lorem ipsum mouse ...</td>
                  <td>500.000</td>
                  <td>600</td>
                  <td style={{ maxWidth: "190px" }}>
                    <Button className="btn-action btn-edit me-3">Edit</Button>
                    <Button className="btn-action btn-delete">Delete</Button>
                  </td>
                </tr> */}
              </tbody>
            </Table>
          </Row>
        </Container>
        <DeleteModal
          setConfirmDelete={setConfirmDelete}
          show={show}
          handleClose={handleClose}
        />
      </div>
    </div>
  );
}
