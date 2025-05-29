import { create } from 'zustand';
import io from 'socket.io-client';
import toast from 'react-hot-toast';
import axios from 'axios';

// useMessageStore.js
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'https://deploy-back-3.onrender.com').replace(/\/$/, '');
const useMessageStore = create((set, get) => ({
  // États
  messages: [],
  users: [],
  onlineUsers: [],
  filteredOnlineUsers: [],
  allUsers: [],
  selectedUser: null,
  socket: null,
  currentUser: null,
  isUsersLoading: false,
  showOnlineOnly: false,
  error: null,
  unreadSenders: new Set(),
  
  

  // Actions
  setCurrentUser: (user) => set({ 
    currentUser: user ? get().processUser(user) : null 
  }),
  setSelectedUser: (user) => {
    if (user) {
      // Retirer l'utilisateur des non-lus lors de la sélection
      set(state => {
        const newUnread = new Set(state.unreadSenders);
        newUnread.delete(user._id);
        return { 
          selectedUser: user,
          unreadSenders: newUnread 
        };
      });
    } else {
      set({ selectedUser: user });
    }
  },
   addUnreadSender: (senderId) => {
    set(state => ({
      unreadSenders: new Set(state.unreadSenders).add(senderId)
    }));
  },
  setMessages: (messages) => set({ messages: get().deduplicateMessages(messages) }),

addMessage: (newMessage) => {
  set(state => ({
    messages: state.messages.map(msg => 
      msg.tempId === newMessage.tempId 
        ? { ...newMessage, image: newMessage.image + `?t=${Date.now()}` } 
        : msg
    )
  }));
},

deduplicateMessages: (messages) => {
  const seen = new Map();
  return messages.filter(msg => {
    const idKey = msg._id || `temp-${msg.tempId}`;
    return !seen.has(idKey) && seen.set(idKey, true);
  });
},
  deduplicateUsers: (users) => {
    const seen = new Map();
    return users.filter(user => {
      const key = user._id;
      if (!seen.has(key)) {
        seen.set(key, true);
        return true;
      }
      return false;
    });
  },
  
  updateMessageStatus: (tempId, status) => {
    set(state => ({
      messages: state.messages.map(msg => {
        // Vérifier si c'est le message temporaire
        if (msg.tempId === tempId || msg._id === tempId) {
          return { ...msg, status };
        }
        return msg;
      })
    }));
  },
selectUserById: (userId) => {
  const state = get();
  const user = state.users.find(u => u._id === userId);
  if (user) {
    state.setSelectedUser(user);
    state.getMessages(user._id);
  }
},
  // Gestion des utilisateurs
  fetchAllUsers: async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/api/messages/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({
        allUsers: Array.isArray(res.data) ? res.data.map(get().processUser) : [],
        error: null
      });
    } catch (error) {
      set({ allUsers: [], error: error.message });
      toast.error('Erreur de chargement des utilisateurs');
    }
  },

  fetchOnlineUsers: async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/api/messages/online-users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({
        filteredOnlineUsers: Array.isArray(res.data) ? res.data.map(get().processUser) : [],
        error: null
      });
    } catch (error) {
      set({ filteredOnlineUsers: [], error: error.message });
      toast.error('Échec de chargement des utilisateurs en ligne');
    }
  },

  toggleOnlineFilter: () => {
    set(state => ({ showOnlineOnly: !state.showOnlineOnly }));
    get().refreshUsers();
  },

  refreshUsers: () => {
    get().showOnlineOnly ? get().fetchOnlineUsers() : get().fetchAllUsers();
  },

  getDisplayedUsers: () => {
    const { showOnlineOnly, filteredOnlineUsers, allUsers } = get();
    return showOnlineOnly ? filteredOnlineUsers : allUsers;
  },

  // Socket.io
// store/useMessageStore.js
initializeSocket: (token) => {
  // Vérifier la présence du token
  if (!token) {
    console.error('Aucun token disponible pour la connexion socket');
    return () => {};
  }

  // Réutiliser le socket existant
  if (get().socket?.connected) return () => {};

  const socket = io(API_BASE_URL, {
    auth: { token },
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 3000,
    // Ajouter des options de gestion d'erreur
    withCredentials: true,
    rejectUnauthorized: false
  });

  // Modifier le gestionnaire 'newMessage'
  socket.on('newMessage', (serverMessage) => {
      try {
        const currentUser = get().currentUser;
        const selectedUser = get().selectedUser;

        // Gestion des messages non lus
        if (
          currentUser &&
          serverMessage.receiverId._id === currentUser._id &&
          (!selectedUser || serverMessage.senderId._id !== selectedUser._id)
        ) {
          get().addUnreadSender(serverMessage.senderId._id);
        }

        const processedSender = serverMessage.sender 
          ? get().processUser(serverMessage.sender)
          : null;

        set(state => {
      const existingIndex = state.messages.findIndex(m => 
        m._id === serverMessage._id || m.tempId === serverMessage.tempId
      );
          const newMessages = existingIndex > -1
        ? state.messages.map((msg, index) => 
            index === existingIndex ? serverMessage : msg)
        : [...state.messages, serverMessage].sort((a, b) => 
            new Date(a.createdAt) - new Date(b.createdAt)
          );

      return {
        messages: get().deduplicateMessages(newMessages),
            users: processedSender 
              ? get().deduplicateUsers([...state.users, processedSender])
              : state.users,
            messages: get().deduplicateMessages(newMessages)
          };
        });
      } catch (error) {
        console.error('Erreur de traitement du message:', error);
      }
    });

    return () => socket.disconnect();
  },

  // Envoi de message
sendMessage: async ({ formData, receiverId, tempId }) => {
  try {
    const token = localStorage.getItem('token');
    const currentUser = get().currentUser;

    // Ajout optimiste AVEC STRUCTURE COMPLÈTE
    get().addMessage({
      tempId,
      text: formData.get('text'),
      image: formData.get('messageImage') ? 
        URL.createObjectURL(formData.get('messageImage')) : 
        null,
      receiverId,
      senderId: { // Structure complète obligatoire
        _id: currentUser._id,
        name: currentUser.name,
        photo: currentUser.photo
      },
      createdAt: new Date().toISOString(),
      status: 'sending'
    });

    const response = await axios.post(
      `${API_BASE_URL}/api/messages/send/${receiverId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      }
    );
    const serverMessage = response.data.data;

    // Utiliser processUser pour normaliser l'expéditeur
    const sender = serverMessage.senderId?.nom 
      ? serverMessage.senderId 
      : get().currentUser;
    const processedSender = get().processUser(sender);

   const finalMessage = {
  ...serverMessage,
  image: serverMessage.image, 
  status: 'sent',
  senderId: processedSender
};

    set(state => ({
      messages: get().deduplicateMessages(
        state.messages.map(msg => 
          msg.tempId === tempId ? finalMessage : msg
        )
      )
    }));
  } catch (error) {
    set(state => ({
      messages: state.messages.map(msg =>
        msg.tempId === tempId ? 
          { ...msg, status: 'failed' } : 
          msg
      )
    }));
    throw error;
  }
},
  getMessages: async (userId) => {
  try {
    const token = localStorage.getItem('token');
    const res = await axios.get(`${API_BASE_URL}/api/messages/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const normalizedMessages = res.data.data.map(msg => ({
      ...msg,
      senderId: {
        _id: msg.senderId._id,
        name: msg.senderId.nom,
        photo: msg.senderId.photo
      },
      receiverId: msg.receiverId._id,
      createdAt: msg.createdAt
    }));

    // Tri chronologique
    const sortedMessages = normalizedMessages.sort((a, b) => 
      new Date(a.createdAt) - new Date(b.createdAt)
    );

    set({ messages: get().deduplicateMessages(sortedMessages) });
  } catch (error) {
    console.error('Erreur de chargement des messages :', error);
  }
},
  fetchCurrentUser: async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/api/user/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data) {
        const processedUser = {
          _id: String(res.data._id),
          name: res.data.nom || 'Utilisateur inconnu',
          photo: res.data.photo,
          email: res.data.email
        };
        
        console.log('Current user fetched:', processedUser);
        set({ currentUser: processedUser });
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
      set({ currentUser: null });
    }
  },
  // Formatage utilisateur
processUser: (user) => {
  if (!user) return null;

 const getPhotoUrl = (path) => {
    if (!path) return `${API_BASE_URL}/default-avatar.png`;
    
    // Ne pas ajouter de paramètre de cache aux URLs externes
    if (path.startsWith('http')) return path;

    // Gestion locale uniquement
    const separator = path.includes('?') ? '&' : '?';
    return `${API_BASE_URL}/uploads/${path}${separator}t=${Date.now()}`;
  };

  return {
    _id: user._id?.toString(),
    name: user.nom || user.name || 'Utilisateur inconnu',
    photo: getPhotoUrl(user.photo),
    isOnline: user.isOnline || false
  };
}
}));

export default useMessageStore;