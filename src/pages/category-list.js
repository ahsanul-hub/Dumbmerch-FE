import React, { useState, useEffect } from "react";
import NavbarAdmin from "../components/navbaradmin";
import DeleteModal from "../components/deleteModal";
import { Container, Row, Col, Table, Button } from "react-bootstrap";
import { API } from "../config/api";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function Category() {
  const [categories, setCategories] = useState([]);

  const [idDelete, setIdDelete] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const getCategories = async () => {
    try {
      const response = await API.get("/categories");
      setCategories(response.data.data);
      console.log(response.data.data);
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
      await API.delete(`/category/${id}`);
      getCategories();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (confirmDelete) {
      // Close modal confirm delete data
      handleClose();
      // execute delete data by id function
      deleteById(idDelete);
      setConfirmDelete(null);
    }
  }, [confirmDelete]);

  useEffect(() => {
    getCategories();
  }, []);
  return (
    <div>
      <NavbarAdmin />
      <div className="vh-100 list-page">
        <Container>
          <h1 className="mb-5 header-list-product">List Category</h1>
          <Link to="/add-category">
            <Button className="btn-dark btn-add-list">Tambah Category</Button>
          </Link>
          <Row>
            <Table striped hover variant="dark">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Product Name</th>
                  <th style={{ maxWidth: "300px" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {categories?.map((item, index) => (
                  <tr>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td style={{ maxWidth: "90px" }}>
                      <Link to={`/edit-category/${item.id}`}>
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
                  <td>Mouse</td>
                  <td style={{ maxWidth: "90px" }}>
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
