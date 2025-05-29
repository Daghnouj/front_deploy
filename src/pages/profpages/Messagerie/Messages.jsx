// components/messages/Messages.tsx
import { useEffect } from "react"
import Sidebar from "./Sidebar"
import ChatHeader from "./ChatHeader"
import MessageList from "./MessageList"
import MessageInput from "./MessageInput"
import useMessageStore from "../../store/useMessageStore"


const Messages = () => {
  const { selectedUser, currentUser } = useMessageStore()
  useEffect(() => {
    const initialize = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // 1. Récupérer l'utilisateur d'abord
          await useMessageStore.getState().fetchCurrentUser();
          
          // 2. Initialiser le socket après
          const cleanup = useMessageStore.getState().initializeSocket(token);
          
          // 3. Vérifier l'utilisateur dans le store
          console.log('Post-init currentUser:', useMessageStore.getState().currentUser);
          
          return cleanup;
        } catch (error) {
          console.error('Initialization error:', error);
        }
      }
    };
    initialize();
  }, []);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const cleanup = useMessageStore.getState().initializeSocket(token);
      // Ajouter le fetch de l'utilisateur courant
      useMessageStore.getState().fetchCurrentUser(); 
      return cleanup;
    }
  }, []);
  
useEffect(() => {
  const token = localStorage.getItem("token")
  if (token && selectedUser) {
    const fetchMessages = async () => {
      await useMessageStore.getState().getMessages(selectedUser._id);
      // Forcer le rafraîchissement après le chargement
      useMessageStore.getState().setMessages([...useMessageStore.getState().messages]);
    }
    fetchMessages()
  }
}, [selectedUser])

  return (
    <div className="messages-container">
      <Sidebar />
      
      <div className="chat-container">
        {selectedUser ? (
          <div className="chat-content">
            <ChatHeader />
            <MessageList />
            <div className="input-container">
              <MessageInput />
            </div>
          </div>
        ) : (
          <div className="welcome-screen">
            <div className="welcome-content">
              <div className="welcome-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                </svg>
              </div>
              <h2 className="welcome-title">Bienvenue {currentUser?.name} 👋</h2>
              <p className="welcome-text">
                Sélectionnez une conversation ou démarrez-en une nouvelle pour commencer à discuter
              </p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .messages-container {
          display: flex;
          height: 100vh;
          background: #f8fafc;
        }

        .chat-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          position: relative;
          background: linear-gradient(to bottom right, #f8fafc, #f1f5f9);
        }

        .chat-content {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .input-container {
          margin-top: auto;
          padding: 1.5rem;
          background: linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0.95) 50%, rgba(255,255,255,0) 100%);
        }

        .welcome-screen {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: rgba(255, 255, 255, 0.6);
        }

        .welcome-content {
          text-align: center;
          max-width: 400px;
        }

        .welcome-icon {
          margin-bottom: 1.5rem;
        }

        .welcome-icon svg {
          width: 80px;
          height: 80px;
          color: #cbd5e1;
        }

        .welcome-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 1rem;
        }

        .welcome-text {
          color: #64748b;
          line-height: 1.5;
        }

        @media (max-width: 768px) {
          .messages-container {
            flex-direction: column;
          }
          
          .welcome-icon svg {
            width: 60px;
            height: 60px;
          }

          .input-container {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  )
}

export default Messages