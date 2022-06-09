import React, { useEffect, useState, useContext } from "react";
import Nav from "../components/navbar";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import User from "../assets/user.png";
import { UserContext } from "../context/userContext";
import { io } from "socket.io-client";

let socket;

export default function Complain() {
  const [contact, setContact] = useState(null); // data contact yang diklik
  const [contacts, setContacts] = useState([]); // data contact dari server
  const [state] = useContext(UserContext);

  const [messages, setMessages] = useState([]);

  const loadContact = () => {
    socket.emit("load admin contact");
    socket.on("admin contact", (data) => {
      let dataContacts = {
        ...data,
        message: "Click here to start message",
      };
      setContacts([dataContacts]);
      console.log(dataContacts);
    });
  };

  const loadMessages = () => {
    socket.on("messages", (data) => {
      if (data.length > 0) {
        const dataMessages = data.map((item) => ({
          idSender: item.sender.id,
          message: item.message,
        }));
        setMessages(dataMessages);
      }
      console.log(data);
      loadContact();
    });
    // console.log(messages);
    console.log("masuk");
  };

  const onSendMessage = (e) => {
    if (e.key === "Enter") {
      const data = {
        idRecipient: contact.id,
        message: e.target.value,
      };

      socket.emit("send message", data);
      e.target.value = "";
    }
    console.log("masuk");
    loadMessages();
  };

  useEffect(() => {
    socket = io("http://localhost:5000", {
      auth: {
        token: localStorage.getItem("token"),
      },
      query: {
        id: state.user.id,
      },
    });

    socket.on("new message", () => {
      // console.log("contact : ", contact);
      socket.emit("load messages", contact?.id);
    });

    loadContact();

    loadMessages();

    socket.on("connect_error", (err) => {
      console.log(err.message); //Not Authorized
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const onClickContact = (data) => {
    setContact(data);
    socket.emit("load messages", data.id);

    console.log(messages);
  };

  return (
    <div>
      <Nav />
      <div className="vh-100 complain-page">
        <Row className="vh-100 ">
          <Col md="5" className="vh-100 border-end border-dark">
            {contacts.length > 0 && (
              <div>
                {contacts.map((item) => (
                  <Row
                    className="contact-list"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      onClickContact(item);
                    }}
                  >
                    <Col xs="4">
                      {/* <img
                        src={item.profile.image}
                        className="me-2 img-contact"
                        alt={"user"}
                      /> */}
                    </Col>
                    <Col>
                      <Row>{item.name}</Row>
                      <Row>{item.message}</Row>
                    </Col>
                  </Row>
                ))}
              </div>
            )}
          </Col>

          {contact ? (
            <>
              <Col md="7" className="vh-100">
                {messages.length > 0 && (
                  <div className="chat-area">
                    {messages.map((item, index) => (
                      // <div
                      //   className={
                      //     item.idSender === state.user.id
                      //       ? "d-flex justify-content-end"
                      //       : "d-flex justify-content-start"
                      //   }
                      // >
                      //   <div className="chat-me chat">{item.message}</div>
                      // </div>
                      <div key={index}>
                        <div
                          className={`d-flex py-1 ${
                            item.idSender === state.user.id
                              ? "justify-content-end"
                              : "justify-content-start"
                          }`}
                        >
                          <div
                            className={
                              item.idSender === state.user.id
                                ? "chat-me"
                                : "chat-other"
                            }
                          >
                            {item.message}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {/* <div className="chat-area">
              <div className="d-flex justify-content-start chat">
                <div className="chat-me">2</div>
              </div>
            </div> */}
                <Row>
                  <Form.Group className="mb-2" c>
                    <input
                      type="text"
                      className="message-input"
                      placeholder="Send Message"
                      onKeyPress={onSendMessage}
                    />
                  </Form.Group>
                </Row>
              </Col>
            </>
          ) : (
            <Col>
              <div
                style={{ height: "89.5vh", marginLeft: "400px" }}
                className="h4 d-flex align-items-center"
              >
                No Message
              </div>
            </Col>
          )}
        </Row>
      </div>
    </div>
  );
}
