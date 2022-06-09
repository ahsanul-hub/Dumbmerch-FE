import NavbarAdmin from "../components/navbaradmin"
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { API } from '../config/api'


export default function Addcategory(){
    let navigate = useNavigate();

    const [category, setCategory] = useState("")

    const handleChange = (e) => {
        setCategory(e.target.value);
      };
    
    const handleSubmit = async (e) => {
        try {
          e.preventDefault();
    

          const config = {
            headers: {
              "Content-type": "application/json"
            }
          }
    
          // Convert form data to string here ...
          const body = JSON.stringify({ name: category })
    
          // Insert data category for login process here ...
          const response = await API.post('/category', body, config)
          console.log(response);
    
          navigate("/category");
        } catch (error) {
          console.log(error);
        }
      };


    return(
        <div>
            <NavbarAdmin />
            <div className="vh-100 list-page">
            <Container >
                <h1 className="mb-5 header-list-product">Add Category</h1>
            <Row>
            <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-2" controlId="formGroupPassword">
                <Form.Control type="text" onChange={handleChange} value={category} name="category" className="form-input" placeholder="Category" />
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