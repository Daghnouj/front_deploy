import { useState, useRef, useEffect } from 'react';
import { Smile, Send } from 'lucide-react';
import Picker from 'emoji-picker-react';
import './MessageInput.css';
import useMessageStore from '../../store/useMessageStore';

const MessageInput = () => {
  const [text, setText] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const { selectedUser, currentUser, addMessage, sendMessage, updateMessageStatus } = useMessageStore();
  const emojiPickerRef = useRef(null);

  // Fermer le picker d'emojis quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target)) {
        setShowEmojis(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text || !selectedUser) return;

    const tempId = `temp-${crypto.randomUUID()}`;
    
    // Ajout optimiste avec vérification des doublons
    addMessage({
      tempId,
      text,
      receiverId: selectedUser._id,
      status: 'sending',
      createdAt: new Date().toISOString(),
      senderId: currentUser._id,
      senderName: currentUser.name,
      senderPhoto: currentUser.photo
    });

    try {
      const formData = new FormData();
      formData.append('text', text);
      formData.append('tempId', tempId);

      await sendMessage({
        formData,
        receiverId: selectedUser._id,
        tempId
      });

    } catch (error) {
      updateMessageStatus(tempId, 'failed');
      console.error('Erreur envoi message:', error);
    } finally {
      setText('');
    }
  };

  return (
    <div className="messageInputContainer">
      <form onSubmit={handleSubmit} className="inputForm">
        <div className="inputWrapper">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`Message à ${selectedUser?.name || ''}...`}
            className="messageInput"
            aria-label="Entrez votre message"
          />
          
          <div className="inputActions">
            <button
              type="button"
              onClick={() => setShowEmojis(!showEmojis)}
              className="emojiBtn"
              aria-label="Sélecteur d'emojis"
            >
              <Smile className="icon" />
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={!text}
          className="sendBtn"
          aria-label="Envoyer le message"
        >
          <Send className="sendIcon" />
        </button>
      </form>

      {showEmojis && (
        <div className="emojiPicker" ref={emojiPickerRef}>
          <Picker
            onEmojiClick={(emoji) => setText(prev => prev + emoji.emoji)}
            pickerStyle={{
              width: '100%',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              backgroundColor: '#f8fafc'
            }}
            groupVisibility={{
              flags: false,
              recently_used: true
            }}
            skinTonesDisabled
            previewConfig={{
              showPreview: false
            }}
          />
        </div>
      )}
    </div>
  );
};

export default MessageInput;