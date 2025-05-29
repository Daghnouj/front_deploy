import React, { useState } from "react";
import { FaEnvelope, FaCircle, FaArrowLeft } from "react-icons/fa";

const CommunicationsPage = () => {
  const [selectedMessage, setSelectedMessage] = useState(null); // State to track selected message
    const [messageInput, setMessageInput] = useState(""); // State to track message input
  
    const messageList = [
        { sender: "Thérapeute - Alice Fontaine", content: "Bonjour, avez-vous reçu les résultats des analyses ?", time: "10:15 AM", profilePic: "https://via.placeholder.com/40", online: true },
        { sender: "Thérapeute - Marc Dupont", content: "Merci pour votre consultation d'hier !", time: "09:30 AM", profilePic: "https://via.placeholder.com/40", online: false },
        { sender: "Thérapeute - Sophie Durand", content: "Votre planning a été mis à jour.", time: "08:45 AM", profilePic: "https://via.placeholder.com/40", online: true }
        
    ];
  
    const handleClick = (message) => {
      setSelectedMessage(message); // Set selected message when clicked
    };
  
    const handleInputChange = (event) => {
      setMessageInput(event.target.value); // Handle input change for new messages
    };
  
    const handleSendMessage = () => {
      if (messageInput.trim()) {
        // Add logic to send message (For now, just clear the input field)
        setMessageInput(""); // Clear input field after sending
      }
    };
  
    return (
      <div className="container mt-4">
        <h2 className="text-primary"><FaEnvelope /> Messages</h2>
  
        {/* Message List */}
        {!selectedMessage ? (
          <div className="card mt-3 shadow-sm">
            <div className="card-header bg-dark text-white">
              <h5>Boîte de réception</h5>
            </div>
            <div className="card-body">
              <ul className="list-group">
                {messageList.map((message, index) => (
                  <li
                    className="list-group-item d-flex align-items-center p-3 mb-2 hover-effect"
                    key={index}
                    onClick={() => handleClick(message)} // Add onClick handler
                    style={{
                      cursor: "pointer",
                      backgroundColor: selectedMessage === message ? "#f0f0f0" : "transparent",
                      transition: "background-color 0.3s",
                      borderLeft: `5px solid ${message.online ? '#28a745' : '#6c757d'}`, // Green if online, gray if offline
                    }}
                  >
                    <img src={message.profilePic} alt="Profile" className="rounded-circle me-3" width="50" height="50" />
                    <div className="flex-grow-1">
                      <strong>{message.sender}</strong> - <span className="text-muted">{message.time}</span>
                      <p className="mb-0 text-truncate" style={{ maxWidth: "220px" }}>{message.content}</p>
                    </div>
                    <FaCircle className={message.online ? "text-success" : "text-secondary"} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          // Conversation View
          <div className="card mt-3 shadow-lg">
            <div className="card-header bg-primary text-white d-flex align-items-center">
              <FaArrowLeft className="me-3" style={{ cursor: "pointer" }} onClick={() => setSelectedMessage(null)} />
              <h5>Conversation avec {selectedMessage.sender}</h5>
            </div>
            <div className="card-body" style={{ height: "300px", overflowY: "scroll" }}>
              {/* Displaying the conversation */}
              <div className="message-box mb-3">
                <div className="d-flex align-items-start mb-2">
                  <img src={selectedMessage.profilePic} alt="Profile" className="rounded-circle me-3" width="50" height="50" />
                  <div>
                    <strong>{selectedMessage.sender}</strong>
                    <p className="bg-light p-2 rounded" style={{ maxWidth: "75%" }}>{selectedMessage.content}</p>
                  </div>
                </div>
              </div>
              {/* Add more messages if needed */}
            </div>
  
            {/* Message Input Box */}
            <div className="card-footer bg-light">
              <div className="d-flex">
                <input
                  type="text"
                  className="form-control me-2"
                  value={messageInput}
                  onChange={handleInputChange}
                  placeholder="Tapez votre message..."
                  style={{ borderRadius: "20px", padding: "10px 20px" }}
                />
                <button
                  className="btn btn-primary"
                  onClick={handleSendMessage}
                  style={{
                    borderRadius: "20px",
                    padding: "10px 20px",
                    backgroundColor: "#007bff",
                    border: "none",
                  }}
                >
                  Envoyer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
export default CommunicationsPage;
