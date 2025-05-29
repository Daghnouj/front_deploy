// components/ProfessionalChatBot.jsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Chatbot.css"; 

const predefinedQuestions = [
  "Détection précoce de la dépression ?",
  "Gestion du stress scolaire efficace ?",
  "Signes de trouble anxieux grave ?",
  "Communication avec un adolescent en crise ?",
  "Différence psychologue/psychiatre ?",
  "Quand initier une thérapie familiale ?"
];

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, showQuestions]);

  const handleSend = async (text) => {
    if (!text.trim() || isLoading) return;

    const newMessage = { sender: "user", text };
    setMessages(prev => [...prev, newMessage]);
    setUserInput("");
    setShowQuestions(false);
    setIsLoading(true);

    try {
      const { data } = await axios.post("https://deploy-back-3.onrender.com/api/chat", {
        message: text
      });

      const cleanReply = data.reply
        .replace(/\*\*/g, '')
        .replace(/^/, '💡 ')
        .replace(/dépression/gi, '😔 dépression')
        .replace(/stress/gi, '😥 stress')
        .replace(/conseil/gi, '👩⚕️ conseil')
        .replace(/aide/gi, '🤝 aide');

      setMessages(prev => [...prev, {
        sender: "bot",
        text: cleanReply || "❌ Réponse non disponible"
      }]);
      
    } catch (err) {
      setMessages(prev => [...prev, {
        sender: "bot",
        text: "🚨 Erreur de connexion au service"
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pro-container">
      <button 
        className={`pro-toggle ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="pro-icon">💬</span>
      </button>

      {isOpen && (
        <div className="pro-window">
          <header className="pro-header">
            <div className="pro-title-container">
              <h3>Assistant Professionnel</h3>
              <p className="pro-subtitle">Santé Mentale des Jeunes</p>
            </div>
            <button 
              className="pro-close-btn"
              onClick={() => setIsOpen(false)}
            >
              &times;
            </button>
          </header>

          <main className="pro-conversation">
            <div className="pro-messages">
              {messages.map((msg, i) => (
                <div 
                  key={i} 
                  className={`pro-msg ${msg.sender}`}
                >
                  <div className="pro-bubble">
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {showQuestions && (
              <section className="pro-questions-section">
                <h4 className="pro-questions-title">Questions Courantes :</h4>
                <div className="pro-questions-grid">
                  {predefinedQuestions.map((q, i) => (
                    <button
                      key={i}
                      className="pro-question"
                      onClick={() => handleSend(q)}
                      disabled={isLoading}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {isLoading && (
              <div className="pro-loading">
                <div className="pro-dot"></div>
                <div className="pro-dot"></div>
                <div className="pro-dot"></div>
              </div>
            )}
          </main>

          <footer className="pro-input-section">
            <form 
              className="pro-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(userInput);
              }}
            >
              <button
                type="button"
                className="pro-question-toggle"
                onClick={() => setShowQuestions(!showQuestions)}
                disabled={isLoading}
              >
                💡
              </button>
              
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Écrivez votre message..."
                className="pro-input"
                disabled={isLoading}
              />
              <button 
                type="submit" 
                className="pro-send-btn"
                disabled={!userInput.trim() || isLoading}
              >
                Envoyer
              </button>
            </form>
          </footer>
        </div>
      )}
    </div>
  );
};

export default ChatBot;