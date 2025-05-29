import { useEffect, useRef } from 'react';
import useMessageStore from '../../store/useMessageStore';
import { format, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import './MessageList.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://deploy-back-3.onrender.com';

const MessageList = () => {
  const { messages, currentUser } = useMessageStore();
  const endRef = useRef(null);
  const prevMessagesCount = useRef(messages.length);

  useEffect(() => {
    endRef.current?.scrollIntoView({
      behavior: messages.length > prevMessagesCount.current ? 'smooth' : 'auto',
      block: 'end'
    });
    prevMessagesCount.current = messages.length;
  }, [messages]);

  const getMessageKey = (message) => message._id || message.tempId || crypto.randomUUID();

  const resolveImageUrl = (img) => {
    if (!img) return `${API_BASE_URL}/default-avatar.png?t=${Date.now()}`;
    
    // Gestion des URLs blob locales
    if (img.startsWith('blob:')) return img;
    
    // Construction d'URL absolue avec cache-buster
    try {
      const url = new URL(img, API_BASE_URL);
      url.searchParams.set('t', Date.now());
      return url.toString();
    } catch (error) {
      console.error('Invalid image URL:', img);
      return `${API_BASE_URL}/default-avatar.png?t=${Date.now()}`;
    }
  };

  const groupMessagesByDate = () => {
    const grouped = [];
    let lastDate = null;

    messages.forEach((message) => {
      const currentDate = new Date(message.createdAt);
      const senderId = message.senderId?._id || message.senderId;
      const isCurrentUser = currentUser?._id === senderId?.toString();
      const senderPhoto = message.senderId?.photo;

      // Groupement par date
      if (!lastDate || !isSameDay(lastDate, currentDate)) {
        grouped.push(
          <div key={`date-${currentDate}`} className="date-separator">
            {format(currentDate, 'dd MMMM yyyy', { locale: fr })}
          </div>
        );
        lastDate = currentDate;
      }

      grouped.push(
        <div
          key={getMessageKey(message)}
          className={`message-container ${isCurrentUser ? 'outgoing' : 'incoming'}`}
        >
          {!isCurrentUser && (
            <img
              key={resolveImageUrl(senderPhoto)} // Re-render forcé
              src={resolveImageUrl(senderPhoto)}
              className="message-avatar"
              alt={`Avatar de ${message.senderId?.name}`}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `${API_BASE_URL}/default-avatar.png?t=${Date.now()}`;
              }}
            />
          )}
          
          <div className={`message-bubble ${isCurrentUser ? 'outgoing' : 'incoming'}`}>
            {message.image && (
              <img
                key={resolveImageUrl(message.image)} // Re-render forcé
                src={resolveImageUrl(message.image)}
                className="message-image"
                alt="Contenu partagé"
                loading="lazy"
                onLoad={(e) => e.target.style.opacity = 1}
                style={{ opacity: 0, transition: 'opacity 0.3s' }}
              />
            )}
            
            {message.text && <div className="message-text">{message.text}</div>}
            
            <div className="message-footer">
              {!isCurrentUser && (
                <span className="sender-name">
                  {message.senderId?.name}
                </span>
              )}
              <span className="timestamp">
                {format(new Date(message.createdAt), 'HH:mm')}
              </span>
            </div>
          </div>
        </div>
      );
    });

    return grouped;
  };

  return (
    <div className="message-list-container">
      <div className="messages-scroll-area">
        {groupMessagesByDate()}
        <div ref={endRef} className="scroll-anchor" />
      </div>
    </div>
  );
};

export default MessageList;

