import { create } from 'zustand';
import axios from 'axios';
import { io } from 'socket.io-client';
const API_BASE_URL = 'http://localhost:5000';

const useCommunityStore = create((set, get) => ({
  posts: [],
  newPostContent: '',
  userId: '',
  userInfo: null,
  isLoading: false,
  error: null,
  notifications: [],
  unreadCount: 0,
  showNotifications: false,
  popularHashtags: [],
  socket: null,
  isSocketConnected: false,
  isSocketInitialized: false, 
  showFavoritesModal: false,
  selectedPost: null,
  notificationTarget: null,
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  searchedPosts: [],
  setSearchedPosts: (posts) => set({ searchedPosts: posts }),
  showCommentModal: false,

  setSelectedPost: (post) => set({ selectedPost: post }),
  setShowFavoritesModal: (show) => set({ showFavoritesModal: show }),
  setNewPostContent: (content) => set({ newPostContent: content }),
  setUserId: (id) => set({ userId: id }),
  clearError: () => set({ error: null }),
  setShowNotifications: (show) => set({ showNotifications: show }),
  setNotificationTarget: (target) => set({ notificationTarget: target }),
  clearNotificationTarget: () => set({ notificationTarget: null }),
  setShowCommentModal: (show) => set({ showCommentModal: show }),

fetchPosts: async () => {
  set({ isLoading: true, error: null });
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/api/posts/posts`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    // Fonction de traitement réutilisable pour les utilisateurs
    const processUser = (user) => {
      if (!user) return {
        photo: `${API_BASE_URL}/default-avatar.png`,
        nom: 'Utilisateur inconnu',
        role: 'user'
      };
      
      return {
        ...user,
        _id: user._id?.toString(),
        photo: user.photo 
          ? user.photo.startsWith('http') // Vérification des URLs externes
            ? user.photo 
            : `${API_BASE_URL}/uploads/${user.photo}`
          : `${API_BASE_URL}/default-avatar.png`
      };
    };

    // Traitement récursif des réponses
    const processReplies = (replies) => {
      return (replies || []).map(reply => ({
        ...reply,
        user: processUser(reply.user),
        // Traitement des sous-réponses si nécessaire
        replies: processReplies(reply.replies) 
      }));
    };

    // Traitement des commentaires
    const processComments = (comments) => {
      return (comments || []).map(comment => ({
        ...comment,
        user: processUser(comment.user),
        replies: processReplies(comment.replies)
      }));
    };

    // Construction du feed final
    const postsWithUser = response.data.map(post => ({
      ...post,
      user: processUser(post.user),
      comments: processComments(post.comments),
      // Ajout du traitement pour les prévisualisations
      preview: post.preview?.startsWith('http') 
        ? post.preview 
        : `${API_BASE_URL}/uploads/${post.preview}`
    }));

    set({ posts: postsWithUser, isLoading: false });
    return postsWithUser;
  } catch (error) {
    set({ 
      error: error.response?.data?.message || error.message, 
      isLoading: false 
    });
  }
},

  fetchUserInfo: async (userId) => {
    if (!userId) return;
    
    set({ isLoading: true });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/api/user/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000
        }
      );

     set({ 
  userInfo: {
    ...response.data,
    photo: response.data.photo 
      ? response.data.photo.startsWith('http') // Modification ici
        ? response.data.photo
        : `http://localhost:5000/uploads/${response.data.photo}`
      : 'http://localhost:5000/default.png'
  },
  isLoading: false 
});
    } catch (error) {
      set({ 
        error: error.response?.data?.message || error.message,
        isLoading: false
      });
    }
  },
  createPost: async () => {
    const { newPostContent, fetchPosts } = get();
    console.log('[Frontend] Tentative de création de post:', newPostContent);

    set({ isLoading: true, error: null });

    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token non trouvé');

        const response = await axios.post(
            'http://localhost:5000/api/posts/addPost',
            { content: newPostContent },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        console.log('[Frontend] Réponse du serveur:', response.data);
        set({ newPostContent: '' });
        await fetchPosts();

    } catch (error) {
        console.error('[Frontend] Erreur complète:', {
            message: error.message,
            response: error.response?.data
        });
        set({ error: error.response?.data?.message || error.message });
    } finally {
        set({ isLoading: false });
    }
},
likePost: async (postId) => {
  const { fetchPosts } = get();
  set({ isLoading: true, error: null });
  
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_BASE_URL}/api/posts/${postId}/like`,
      {},
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    // Mise à jour optimiste sécurisée
    set(state => ({
      posts: state.posts.map(post => {
        if (post._id === postId) {
          return {
            ...post,
            likes: response.data.post.likes,
            likedBy: response.data.post.likedBy || []
          };
        }
        return post;
      })
    }));

  } catch (error) {
    console.error('[ERREUR CLIENT]', {
      config: error.config,
      response: error.response?.data
    });
    
    set({ error: 
      error.response?.data?.message || 
      'Erreur de communication avec le serveur'
    });
    
    // Restauration par rafraîchissement
    await fetchPosts();
  } finally {
    set({ isLoading: false });
  }
},
addComment: async (postId, text) => {
  const { fetchPosts } = get();
  try {
    const token = localStorage.getItem('token');
    await axios.post(
      `http://localhost:5000/api/posts/${postId}/comment`,
      { comment: text },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    await fetchPosts();
  } catch (error) {
    set({ error: error.message });
  }
},

updateComment: async (postId, commentId, newText) => {
  const { fetchPosts } = get();
  try {
    const token = localStorage.getItem('token');
    await axios.put(
      `http://localhost:5000/api/posts/${postId}/comments/${commentId}`,
      { newText },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    await fetchPosts();
  } catch (error) {
    set({ error: error.message });
  }
},

deleteComment: async (postId, commentId) => {
  const { fetchPosts } = get();
  try {
    const token = localStorage.getItem('token');
    await axios.delete(
      `http://localhost:5000/api/posts/${postId}/comments/${commentId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    await fetchPosts();
  } catch (error) {
    set({ error: error.message });
  }
},

addReply: async (postId, commentId, text) => {
  const { fetchPosts } = get();
  try {
    const token = localStorage.getItem('token');
    await axios.post(
      `http://localhost:5000/api/posts/${postId}/comments/${commentId}/reply`,
      { replyText: text },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    await fetchPosts();
  } catch (error) {
    set({ error: error.message });
  }
},

updateReply: async (postId, commentId, replyId, newText) => {
  const { fetchPosts } = get();
  try {
    const token = localStorage.getItem('token');
    await axios.put(
      `http://localhost:5000/api/posts/${postId}/comments/${commentId}/replies/${replyId}`,
      { newText },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    await fetchPosts();
  } catch (error) {
    set({ error: error.message });
  }
},

deleteReply: async (postId, commentId, replyId) => {
  const { fetchPosts } = get();
  try {
    const token = localStorage.getItem('token');
    await axios.delete(
      `http://localhost:5000/api/posts/${postId}/comments/${commentId}/replies/${replyId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    await fetchPosts();
  } catch (error) {
    set({ error: error.message });
  }
},
// Fonction de traitement des utilisateurs
processUser: (user) => {
  if (!user) {
    return {
      photo: `${API_BASE_URL}/default.png`,
      nom: 'Utilisateur inconnu',
      role: 'user'
    };
  }
  return {
    ...user,
    _id: user._id?.toString(),
    photo: user.photo 
      ? user.photo.startsWith('http') // Vérification ici
        ? user.photo 
        : `${API_BASE_URL}/uploads/${user.photo}`
      : `${API_BASE_URL}/default.png`
  };
},

fetchNotifications: async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/api/notifications`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const processNotification = (notification) => ({
      ...notification,
      sender: get().processUser(notification.sender),
      metadata: {
        ...notification.metadata,
        postPreview: notification.metadata?.postPreview?.startsWith('http')
          ? notification.metadata.postPreview
          : `${API_BASE_URL}/uploads/${notification.metadata.postPreview}`
      }
    });

    const processedNotifications = response.data.map(processNotification);
    
    set({ 
      notifications: processedNotifications,
      unreadCount: processedNotifications.filter(n => !n.read).length 
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
  }
},

markAsRead: async (notificationIds) => {
  try {
    const token = localStorage.getItem('token');
    await axios.patch(`${API_BASE_URL}/api/notifications/mark-read`, {
      notificationIds
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    set(state => ({
      notifications: state.notifications.map(n => 
        notificationIds.includes(n._id) ? { ...n, read: true } : n
      ),
      unreadCount: state.unreadCount - notificationIds.length
    }));
    
  } catch (error) {
    console.error('Error marking as read:', error);
  }
},
markAllAsRead: async () => {
  try {
    const token = localStorage.getItem('token');
    await axios.patch(`${API_BASE_URL}/api/notifications/mark-read`, {
      all: true
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    set(state => ({
      notifications: state.notifications.map(n => ({ ...n, read: true })),
      unreadCount: 0
    }));
    
  } catch (error) {
    console.error('Error marking all as read:', error);
  }
},
initializeSocket: (token) => {
  const { socket, isSocketInitialized } = get();
  
  // Nettoyer l'ancienne connexion
  if (socket && isSocketInitialized) {
    socket.disconnect();
    socket.removeAllListeners();
  }

  const newSocket = io(API_BASE_URL, {
    auth: { token },
    withCredentials: true,
    reconnection: true,
    reconnectionAttempts: 3,
    reconnectionDelay: 5000
  });

  // Gestionnaire de connexion
  newSocket.on('connect', () => {
    console.log('Socket connecté');
    set({ isSocketConnected: true, isSocketInitialized: true });
  });

  // Gestionnaire de notification
  newSocket.on('new_notification', (notification) => {
    set(state => {
      // Vérification des doublons
      const exists = state.notifications.some(n => n._id === notification._id);
      if (exists) return state;
      
      return {
        notifications: [notification, ...state.notifications],
        unreadCount: notification.read ? state.unreadCount : state.unreadCount + 1
      };
    });
  });

  // Gestionnaire de déconnexion
  newSocket.on('disconnect', (reason) => {
    console.log('Socket déconnecté:', reason);
    set({ isSocketConnected: false });
  });

  // Gestion des erreurs
  newSocket.on('connect_error', (err) => {
    console.error('Erreur de connexion:', err.message);
    setTimeout(() => newSocket.connect(), 5000);
  });

  set({ socket: newSocket });
},

// Ajoutez une méthode de nettoyage
cleanupSocket: () => {
  const { socket } = get();
  if (socket) {
    socket.disconnect();
    socket.removeAllListeners();
  }
  set({ socket: null, isSocketInitialized: false });
},
toggleFavorite: async (postId) => {
  const { fetchPosts, userInfo } = get();
  set({ isLoading: true });
  
  try {
    const token = localStorage.getItem('token');
    await axios.post(
      `${API_BASE_URL}/api/posts/${postId}/favorite`,
      { userId: userInfo._id },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    await fetchPosts();
  } catch (error) {
    set({ error: error.response?.data?.message || error.message });
  } finally {
    set({ isLoading: false });
  }
},

// Récupération des hashtags populaires
fetchPopularHashtags: async () => {
  set({ isLoading: true });
  try {
    const response = await axios.get(`${API_BASE_URL}/api/posts/hashtags/popular`);
    set({ 
      popularHashtags: response.data.map(h => ({
        _id: h._id,
        name: h._id, // Le champ '_id' contient le texte du hashtag
        count: h.count
      })) 
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des hashtags:", error);
    set({ error: error.message });
  } finally {
    set({ isLoading: false });
  }
},

updatePost: async (postId, content) => {
  const { fetchPosts } = get();
  try {
    const token = localStorage.getItem('token');
    await axios.put(
      `${API_BASE_URL}/api/posts/${postId}`,
      { content },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    await fetchPosts();
  } catch (error) {
    set({ error: error.response?.data?.message || error.message });
  }
},

deletePost: async (postId) => {
  const { fetchPosts } = get();
  try {
    const token = localStorage.getItem('token');
    await axios.delete(
      `${API_BASE_URL}/api/posts/${postId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    await fetchPosts();
  } catch (error) {
    set({ error: error.response?.data?.message || error.message });
  }
},

fetchSearchPosts: async (query) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(
      `${API_BASE_URL}/api/posts/search?query=${encodeURIComponent(query)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const processUser = (user) => ({
      ...user,
      photo: user.photo?.startsWith('http') 
        ? user.photo 
        : `${API_BASE_URL}/uploads/${user.photo}`,
    });

    const processedPosts = response.data.map(post => ({
      ...post,
      user: processUser(post.user),
      comments: post.comments.map(comment => ({
        ...comment,
        user: processUser(comment.user)
      }))
    }));

    set({ searchedPosts: processedPosts });
  } catch (error) {
    set({ error: error.response?.data?.message || error.message });
  }
},
deleteFavorite: async (postId) => {
  set(state => ({ isLoading: true }));
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/posts/${postId}/favorite`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) throw new Error('Échec de la suppression');
    
    // Mise à jour optimiste
    set(state => ({
      posts: state.posts.map(post => 
        post._id === postId 
          ? { ...post, favorites: post.favorites.filter(id => id !== state.userInfo?._id) }
          : post
      ),
      isLoading: false
    }));
    
  } catch (error) {
    set(state => ({ 
      error: error.message,
      isLoading: false 
    }));
  }
},
}));
export default useCommunityStore;