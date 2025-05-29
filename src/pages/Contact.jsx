import React, { useState } from "react";
import "./Contact.css"; // Custom styles
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { FaLocationDot, FaPhone, FaFax, FaEnvelope } from "react-icons/fa6";
import axios from "axios";

const ContactForm = () => {
  // State for form inputs
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    city: "",
    phone: "",
    subject: "",
    message: "",
  });

  // State for error and success messages
  const [statusMessage, setStatusMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/contact", formData);
      if (response.data.success) {
        setStatusMessage("Message envoyé avec succès !");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          city: "",
          phone: "",
          subject: "",
          message: "",
        });
      }
    } catch (error) {
      setStatusMessage("Une erreur s'est produite, veuillez réessayer.");
      console.error(error);
    }
  };

  return (
    <Container fluid className="contact-section mt-5">
      {/* Title and Description */}
      <Container className="text-start contact-intro">
        <h2>
        If you have any questions, suggestions, or would like to get involved, fill out the form below or reach out to us directly. We’re here to support you.
        </h2>
      </Container>

      <Container className="contact-form mt-4">
        <Row>
          {/* Contact Form */}
          <Col md={7}>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="text"
                      placeholder="Nom"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="text"
                      placeholder="Prénom"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="email"
                      placeholder="Email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="text"
                      placeholder="Ville"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="tel"
                      placeholder="Téléphone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="text"
                      placeholder="Sujet"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  style={{ width:'667px' }}
                />
              </Form.Group>

              <Button type="submit" variant="warning" className="px-4 contact-btn">
                ➤ Send
              </Button>
            </Form>

            {/* Status Message */}
            {statusMessage && <div className="status-message">{statusMessage}</div>}
          </Col>

          {/* Contact Information */}
          <Col md={5}>
            <Card className="contact-card">
              <Card.Body>
                <p>
                  <FaLocationDot /> Rue de charité, Cité El KHADRA, Tunis, Manouba, Tunisia 1003
                </p>
                <p>
                  <FaPhone /> Tel: +216 10 000 563
                </p>
                <p>
                  <FaFax /> Fax: +216 71 000 753
                </p>
                <p>
                  <strong>Horaires:</strong> <br />
                  Siège: Lundi - Vendredi <br />
                  8:00 - 13:00 <br />
                  14:00 - 17:00
                </p>
                <p>
                  <FaEnvelope /> solidarity@gmail.com
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default ContactForm;