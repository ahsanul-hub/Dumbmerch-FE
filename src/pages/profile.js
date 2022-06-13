import React, { useState, useEffect, useContext } from "react";
import Nav from "../components/navbar";
import User from "../assets/user.png";
import { Container, Row, Col } from "react-bootstrap";
import Mouse from "../assets/mouse.png";
import Dumbmerch from "../assets/dumbMerch.png";
import { UserContext } from "../context/userContext";
import { API } from "../config/api";
import convertRupiah from "rupiah-format";
import dateFormat from "dateformat";

export default function Profile() {
  const [profile, setProfile] = useState([]);
  const [transaction, setTransaction] = useState([]);

  // const [stateUserLogin, dispatchUserLogin] = useContext(UserContext);

  const getProfile = async () => {
    try {
      const response = await API.get("/profile");
      setProfile(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getTransactions = async () => {
    try {
      const response = await API.get("/transactions");
      setTransaction(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    getTransactions();
  }, []);

  return (
    <div>
      <Nav />
      <div className="profile-page vh-100">
        <div className="profile-section">
          <h1 style={{ marginBottom: "24px", color: "#F74D4D" }}>My Profile</h1>
          <Container>
            <Row>
              {/* <Col style={{ paddingLeft: "0px", maxWidth: "376px" }}>
                <img src={profile.image} className="profile-img" />
              </Col> */}
              {profile.image !== "http://localhost:5000/uploads/null" ? (
                <Col style={{ paddingLeft: "0px", maxWidth: "376px" }}>
                  <img src={profile?.image} className="profile-img" />
                </Col>
              ) : (
                <Col style={{ paddingLeft: "0px", maxWidth: "376px" }}>
                  <img src={User} className="profile-img" />
                </Col>
              )}
              <Col>
                <div className="bio-title">Name</div>
                <div className="bio-value"> {profile?.user?.name}</div>
                <div className="bio-title">Email</div>
                <div className="bio-value"> {profile?.user?.email}</div>
                <div className="bio-title">Phone</div>
                <div className="bio-value"> {profile?.phone}</div>
                <div className="bio-title">Gender</div>
                <div className="bio-value">{profile?.gender}</div>
                <div className="bio-title">Address</div>
                <div className="bio-value">{profile?.address}</div>
              </Col>
            </Row>
          </Container>
        </div>
        <div className="myTrans-section">
          <h1 style={{ marginBottom: "24px", color: "#F74D4D" }}>
            My Transaction
          </h1>

          {transaction?.map((item, index) => (
            <Container
              style={{ padding: "12px 28px", backgroundColor: "#303030" }}
            >
              <Row>
                <Col xs="3" style={{ padding: "0px" }}>
                  {item.product.image !==
                  "https://res.cloudinary.com/jakarta098/image/upload/v1654973984/null" ? (
                    <Col>
                      <img
                        src={item.product.image}
                        alt="img"
                        // className="img-fluid"
                        style={{
                          height: "120px",
                          width: "80px",
                          objectFit: "cover !important",
                        }}
                      />
                    </Col>
                  ) : (
                    <Col>
                      <img
                        src={
                          "https://res.cloudinary.com/jakarta098/image/upload/v1655136635/dumbmerch/user_mfv78o.png"
                        }
                        style={{
                          maxHeight: "70px",
                          margin: "15px 10px",
                        }}
                      />
                    </Col>
                  )}
                </Col>
                <Col xs="7">
                  <div
                    style={{
                      fontSize: "18px",
                      color: "#F74D4D",
                      fontWeight: "500",
                      lineHeight: "19px",
                    }}
                  >
                    {item.product.name}
                  </div>
                  <div
                    className="mt-2"
                    style={{
                      fontSize: "14px",
                      color: "#F74D4D",
                      fontWeight: "300",
                      lineHeight: "19px",
                    }}
                  >
                    {dateFormat(item.createdAt, "dddd, d mmmm yyyy")}
                  </div>

                  <div
                    className="mt-2"
                    style={{
                      fontSize: "14px",
                      fontWeight: "300",
                      color: "#FFFFFF",
                    }}
                  >
                    Price : {convertRupiah.convert(item.price)}
                  </div>

                  <div
                    className="mt-4"
                    style={{
                      fontSize: "14px",
                      fontWeight: "700",
                      color: "#FFFFFF",
                    }}
                  >
                    Sub Total : {convertRupiah.convert(item.price)}
                  </div>
                </Col>
                <Col xs="2" style={{ padding: "0px" }}>
                  <img
                    src={Dumbmerch}
                    alt="img"
                    className="img-fluid"
                    style={{ maxHeight: "70px", marginTop: "10px" }}
                  />
                </Col>
              </Row>
            </Container>
          ))}
        </div>
      </div>
    </div>
  );
}
