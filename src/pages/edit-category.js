import React, { useState, useEffect } from "react";
import NavbarAdmin from "../components/navbaradmin";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { API } from "../config/api";

export default function Editcategory() {
  const { id } = useParams();
  let navigate = useNavigate();

  const [form, setForm] = useState({
    // name: "",
  });
  const getCategory = async () => {
    const { idCategory } = id;
    try {
      const response = await API.get("/category/" + id);
      setForm(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  // const { name } = form;

  const handleChange = (e) => {
    setForm({
      ...form,
      name: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      // Configuration
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      // Store data with FormData as object
      const body = JSON.stringify(form);

      // Insert product data
      const response = await API.patch("/category/" + id, body, config);
      console.log(response.data);

      navigate("/category");
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getCategory();
  }, []);

  return (
    <div>
      <NavbarAdmin />
      <div className="vh-100 list-page">
        <Container>
          <h1 className="mb-5 header-list-product">Edit Category</h1>
          <Row>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-2" controlId="formGroupPassword">
                <Form.Control
                  type="text"
                  className="form-input"
                  placeholder="Category"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                />
              </Form.Group>
              <Button type="submit" variant="success" className="btn-add">
                Save
              </Button>
            </Form>
          </Row>
        </Container>
      </div>
    </div>
  );
}
