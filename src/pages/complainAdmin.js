import React, { useEffect, useState, useContext } from "react";
import NavbarAdmin from "../components/navbaradmin";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import User from "../assets/user.png";
import { io } from "socket.io-client";
import { UserContext } from "../context/userContext";

let socket;

export default function ComplainAdmin() {
  const [contacts, setContacts] = useState([]); // data contact dari server
  const [contact, setContact] = useState(null); // data contact yang diklik
  const [state] = useContext(UserContext);
  const [messages, setMessages] = useState([]);

  const loadContacts = () => {
    socket.emit("load customer contacts");
    socket.on("customer contacts", (data) => {
      let dataContacts = data.map((item) => ({
        ...item,
        message: "Click here to start message",
      }));
      // console.log(dataContacts);
      setContacts(dataContacts);
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
      loadContacts();
    });
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
  };

  useEffect(() => {
    socket = io(
      "http://localhost:5000" || "https://dumbmerch-ahsanul.herokuapp.com/",
      {
        auth: {
          token: localStorage.getItem("token"),
        },
        query: {
          id: state.user.id,
        },
      }
    );

    socket.on("new message", () => {
      console.log("contact : ", contact);
      socket.emit("load messages", contact?.id);
    });

    loadContacts();
    loadMessages();

    socket.on("connect_error", (err) => {
      console.log(err.message); //Not Authorized
    });

    return () => {
      socket.disconnect();
    };
  }, [messages]);

  const onClickContact = (data) => {
    setContact(data);
    socket.emit("load messages", data.id);
  };

  return (
    <div>
      <NavbarAdmin />
      <div className="complain-page">
        <Row className="">
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
                    <Col xs="3" className="pt-1">
                      <img
                        src={User}
                        className="me-2 img-contact"
                        alt={"user"}
                      />
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
              <Col md="7" className="">
                {messages.length > 0 && (
                  <div className="chat-area">
                    {messages.map((item, index) => (
                      <div key={index}>
                        <div
                          className={`d-flex py-1 ${
                            item.idSender === state.user.id
                              ? "justify-content-end"
                              : "justify-content-start"
                          }`}
                        >
                          <div className="chat-me">{item.message}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
