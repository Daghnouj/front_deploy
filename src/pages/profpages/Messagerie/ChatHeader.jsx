// ChatHeader.jsx
import { X } from "lucide-react";
import useMessageStore from "../../store/useMessageStore";
import "./headerMessage.css";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser, onlineUsers } = useMessageStore();

  if (!selectedUser) return null;

  return (
    <div className="chat-header-container">
      <div className="header-user-info">
        <div className="avatar-wrapper">
          <img
            src={selectedUser.photo || "/default-avatar.png"}
            alt={selectedUser.nom}
            className="user-avatar"
          />
          <div className={`status-indicator ${
            onlineUsers.some(u => u._id === selectedUser._id) 
              ? 'online' 
              : 'offline'
          }`} />
        </div>
        <div className="user-name-container">
          <span className="user-name">{selectedUser.nom}</span>
        </div>
      </div>
      
      <button 
        onClick={() => setSelectedUser(null)}
        className="close-button"
        aria-label="Fermer la conversation"
      >
        <X className="close-icon" />
      </button>
    </div>
  );
};

export default ChatHeader;