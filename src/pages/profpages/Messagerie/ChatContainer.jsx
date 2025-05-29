import { useEffect, useRef, useState } from "react";
import { useMessageStore } from "../store/useMessageStore";
import Picker from 'emoji-picker-react';
import { Smile, Image as ImageIcon, Send, X } from 'lucide-react';

const ChatContainer = () => {
  const { messages, users, onlineUsers, selectedUser, currentUser, sendMessage } = useMessageStore();
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [showEmojis, setShowEmojis] = useState(false);
  const fileRef = useRef();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!text && !image) return;

    const tempId = `temp-${Date.now()}`;
    const newMessage = {
      _id: tempId,
      text,
      image,
      senderId: currentUser._id,
      receiverId: selectedUser._id,
      createdAt: new Date(),
      status: 'sending'
    };

    useMessageStore.getState().addMessage(newMessage);
    
    try {
      await sendMessage({ text, image, receiverId: selectedUser._id });
    } catch (error) {
      useMessageStore.getState().updateMessageStatus(tempId, 'failed');
    }

    setText('');
    setImage(null);
    fileRef.current.value = '';
  };

  const onEmojiClick = (emojiData) => {
    setText(prev => prev + emojiData.emoji);
  };

  return (
    <div className="flex h-screen bg-base-100">
      {/* Sidebar */}
      <div className="w-80 border-r bg-base-200 p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Users className="h-5 w-5" /> Contacts ({users.length})
        </h2>
        
        <div className="space-y-2">
          {users.map(user => (
            <div
              key={user._id}
              onClick={() => useMessageStore.getState().setSelectedUser(user)}
              className={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-base-300 ${
                selectedUser?._id === user._id ? 'bg-base-300' : ''
              }`}
            >
              <div className="relative">
                <img
                  src={user.profilePic || '/default-avatar.png'}
                  className="w-12 h-12 rounded-full"
                  alt={user.name}
                />
                {onlineUsers.includes(user._id) && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>
              <div className="ml-3">
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-gray-500">
                  {onlineUsers.includes(user._id) ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Principal */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between bg-base-100">
              <div className="flex items-center gap-3">
                <img
                  src={selectedUser.profilePic}
                  className="w-10 h-10 rounded-full"
                  alt={selectedUser.name}
                />
                <div>
                  <h3 className="font-bold">{selectedUser.name}</h3>
                  <p className="text-sm text-gray-500">
                    {onlineUsers.includes(selectedUser._id)
                      ? 'En ligne'
                      : 'Hors ligne'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => useMessageStore.getState().setSelectedUser(null)}
                className="btn btn-ghost btn-circle"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-base-200">
              {messages.map(message => (
                <div
                  key={message._id}
                  className={`flex ${message.senderId === currentUser._id ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-md p-3 rounded-lg relative ${
                    message.senderId === currentUser._id
                      ? 'bg-primary text-primary-content'
                      : 'bg-base-100 border'
                  }`}>
                    {message.image && (
                      <img
                        src={message.image}
                        className="mb-2 rounded-lg w-48 h-48 object-cover"
                        alt="Content"
                      />
                    )}
                    <div className="flex items-end gap-2">
                      <p className="flex-1">{message.text}</p>
                      <div className="flex items-center gap-1 text-xs">
                        {message.status === 'sending' && (
                          <span className="loading loading-spinner loading-xs"></span>
                        )}
                        {message.status === 'failed' && (
                          <span className="text-error">!</span>
                        )}
                        <span>
                          {new Date(message.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t bg-base-100 relative">
              {showEmojis && (
                <div className="absolute bottom-20 right-4 z-10">
                  <Picker
                    onEmojiClick={onEmojiClick}
                    pickerStyle={{ width: '300px' }}
                  />
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => setShowEmojis(!showEmojis)}
                  className="btn btn-circle btn-sm"
                >
                  <Smile className="h-4 w-4" />
                </button>

                <input
                  type="file"
                  accept="image/*"
                  hidden
                  ref={fileRef}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () => setImage(reader.result);
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                
                <button
                  onClick={() => fileRef.current.click()}
                  className="btn btn-circle btn-sm"
                >
                  <ImageIcon className="h-4 w-4" />
                </button>

                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Écrivez un message..."
                  className="flex-1 input input-bordered"
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />

                <button
                  onClick={handleSend}
                  disabled={!text && !image}
                  className="btn btn-primary btn-circle"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-base-200">
            <div className="text-center p-8">
              <div className="text-4xl mb-4">👋</div>
              <h2 className="text-xl font-semibold mb-2">
                Bienvenue dans la messagerie
              </h2>
              <p className="text-gray-500">
                Sélectionnez un contact pour commencer à discuter
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatContainer;