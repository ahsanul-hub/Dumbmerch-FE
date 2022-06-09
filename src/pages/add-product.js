import NavbarAdmin from "../components/navbaradmin"
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { API } from '../config/api'


export default function Addproduct(){
    let navigate = useNavigate();

    const [categories, setCategories] = useState([]); 
    const [categoryId, setCategoryId] = useState([]); 
    const [preview, setPreview] = useState(null); 

    const [form, setForm] = useState({
        image: "",
        name: "",
        desc: "",
        price: "",
        qty: ""
      })

      const getCategories = async () => {
        try {
          const response = await API.get("/categories");
          setCategories(response.data.data);
        } catch (error) {
          console.log(error);
        }
      };
    
      const handleChangeCategoryId = (e) => {
        const id = e.target.value;
        const checked = e.target.checked;
    
        if (checked) {
          setCategoryId([...categoryId, parseInt(id)]);
        } else {
          let newCategoryId = categoryId.filter((categoryIdItem) => {
            return categoryIdItem != id;
          });
          setCategoryId(newCategoryId);
        }
      };

      const handleChange = (e) => {
        setForm({
          ...form,
          [e.target.name]: e.target.type === "file" ? e.target.files : e.target.value,
        });
    
        if (e.target.type === "file") {
          let url = URL.createObjectURL(e.target.files[0]);
          setPreview(url);
        }
      };
    
      const handleSubmit = async (e) => {
        try {
          e.preventDefault();
    
          const config = {
            headers: {
              "Content-type": "multipart/form-data"
            }
          }
    
          
          const formData = new FormData()
          formData.set("image", form.image[0], form.image[0].name)
          formData.set("name", form.name)
          formData.set("desc", form.desc)
          formData.set("price", form.price)
          formData.set("qty", form.qty)
          formData.set("categoryId", categoryId)
    
    
          const response = await API.post('/product', formData, config)
    
          console.log(response);
    
          navigate("/list-product");
        } catch (error) {
          console.log(error);
        }
      };
    
      useEffect(() => {
        getCategories();
      }, []);

    return(
        <div>
            <NavbarAdmin />
            <div className="list-page">
            <Container >
                <h1 className="mb-5 header-list-product">Add Product</h1>
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
                <Form.Label className="upload-label">Upload File</Form.Label>
                <Form.Control type="file" name="image" onChange={handleChange} hidden />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroupName">
                <Form.Control type="text" name="name" onChange={handleChange} className="form-input" placeholder="Product Name" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlDesc">
                <Form.Control as="textarea" name="desc" onChange={handleChange} className="form-input" placeholder="Desc Product" rows={3} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroupPrice">
                <Form.Control type="text"  name="price" onChange={handleChange} className="form-input" placeholder="Price" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroupQty">
                <Form.Control type="text" name="qty" onChange={handleChange} className="form-input" placeholder="Qty" />
            </Form.Group>
            <Form.Group>
            <div className="card-form-input mt-4 px-2 py-1 pb-2">
                <div className="text-secondary mb-1" style={{ fontSize: "15px" }}>
                  Category
                </div>
                {categories.map((item, index) => (
                  <label key={index} className="checkbox-inline me-4">
                    <input type="checkbox" value={item.id} onClick={handleChangeCategoryId} /> {item.name}
                  </label>
                ))}
              </div>
              </Form.Group>
                 <Button type="submit" variant="success" className="btn-add">
                  Add
                </Button>
            </Form> 
            </Row>
            </Container>
            </div>
        </div>
    )
}