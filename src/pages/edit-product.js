import React, { useState, useEffect, useContext } from "react";
import NavbarAdmin from "../components/navbaradmin";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { API } from "../config/api";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function Editproduct() {
  const { id } = useParams();
  let navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState([]);
  const [preview, setPreview] = useState(null);
  const [product, setProduct] = useState({});

  const [form, setForm] = useState({
    image: "",
    name: "",
    desc: "",
    price: "",
    qty: "",
  });

  const getProduct = async (id) => {
    try {
      const response = await API.get("/product/" + id);

      setPreview(response.data.data.image);
      setForm({
        ...form,
        name: response.data.data.name,
        desc: response.data.data.desc,
        price: response.data.data.price,
        qty: response.data.data.qty,
      });
      setProduct(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getCategories = async () => {
    try {
      const response = await API.get("/categories");
      setCategories(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    getProduct(id);
  }, []);

  const handleChangeCategoryId = (e) => {};

  // Handle change data on form
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "file" ? e.target.files : e.target.value,
    });

    // Create image url for preview
    if (e.target.type === "file") {
      let url = URL.createObjectURL(e.target.files[0]);
      setPreview(url);
    }
  };

  // Create function for handle submit data ...
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      // Configuration
      const config = {
        headers: {
          "Content-type": "multipart/form-data",
        },
      };

      // Store data with FormData as object
      const formData = new FormData();
      if (form.image) {
        formData.set("image", form?.image[0], form?.image[0]?.name);
      }
      formData.set("name", form.name);
      formData.set("desc", form.desc);
      formData.set("price", form.price);
      formData.set("qty", form.qty);
      formData.set("categoryId", categoryId);

      // Insert product data
      const response = await API.patch(
        "/product/" + product.id,
        formData,
        config
      );
      console.log(formData);

      navigate("/list-product");
    } catch (error) {
      console.log(error);
    }
  };

  // Get category id selected
  useEffect(() => {
    const newCategoryId = product?.categories?.map((item) => {
      return item.id;
    });

    setCategoryId(newCategoryId);
  }, [product]);

  return (
    <div>
      <NavbarAdmin />
      <div className="list-page">
        <Container>
          <h1 className="mb-5 header-list-product">Edit Product</h1>
          <Row>
            <Form onSubmit={handleSubmit}>
              {preview && (
                <div>
                  <img
                    src={preview}
                    style={{
                      maxWidth: "150px",
                      maxHeight: "150px",
                      objectFit: "cover",
                    }}
                    alt="preview"
                  />
                </div>
              )}

              <Form.Group controlId="formFile" className="mb-4">
                <label for="upload" className="upload-label">Upload File</label>
                <Form.Control
                id="upload"
                  type="file"
                  name="image"
                  value={form?.image}
                  onChange={handleChange}
                  hidden
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formGroupEmail">
                <Form.Control
                  type="text"
                  name="name"
                  onChange={handleChange}
                  value={form.name}
                  className="form-input"
                  placeholder="Product Name"
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Control
                  as="textarea"
                  className="form-input"
                  name="desc"
                  onChange={handleChange}
                  value={form.desc}
                  placeholder="Desc Product"
                  rows={3}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formGroupPassword">
                <Form.Control
                  type="text"
                  name="price"
                  onChange={handleChange}
                  value={form.price}
                  className="form-input"
                  placeholder="Price"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formGroupPassword">
                <Form.Control
                  type="text"
                  name="qty"
                  onChange={handleChange}
                  value={form.qty}
                  className="form-input"
                  placeholder="Qty"
                />
              </Form.Group>
              <Form.Group>
                <div className="card-form-input mt-4 px-2 py-1 pb-2">
                  <div
                    className="text-secondary mb-1"
                    style={{ fontSize: "15px" }}
                  >
                    Category
                  </div>
                  {categories.map((item, index) => (
                    <label key={index} className="checkbox-inline me-4">
                      <input
                        type="checkbox"
                        value={item.id}
                        onClick={handleChangeCategoryId}
                      />
                      {item.name}
                    </label>
                  ))}
                </div>
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
