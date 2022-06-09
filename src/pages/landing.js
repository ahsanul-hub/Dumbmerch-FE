import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Logo from "../assets/dumbMerch.png";
import LoginCard from "../components/login";
import RegisterCard from "../components/register";



export default function Landing() {
  // const [login, setLogin] = useState(false)
  const [register, setRegister] = useState(true)

  const showLogin = () => {
    setRegister(false);
  };

  const showRegister = () => {
    setRegister(true);
  };


  return (

    <div className="bg-black">
      <Container>
        <Row className="d-flex">
          <Col md="7" className="left-side mb-5" >
            <img src={Logo} className="logo" style={{ width: '264px', height: '264px' }} />
            <div className="title-landing">
              Easy, Fast and Reliable
                        </div>
            <p className="text-landing">
              Go shopping for merchandise, just go to dumb merch <br /> shopping. the biggest merchandise in <b>Indonesia</b>
            </p>
            <div className="btn-container">
             <button onClick={showLogin} className="btn-nav btn-small-login">Login</button> 
             <button onClick={showRegister} className="btn-nav btn-small-reg">Register</button>               
            </div>
          </Col>
          <Col md="5" >
          {register ? (
        <RegisterCard/>
      ) : (
        <LoginCard />
      )}
           
          </Col>
        </Row>
      </Container>
    </div>
  )
}