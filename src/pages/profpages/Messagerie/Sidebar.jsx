import { useEffect } from "react";
import useMessageStore from "../../store/useMessageStore";
import { Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import fr from "date-fns/locale/fr";
import { Image, Badge } from "react-bootstrap";
import './Sidebar.css';
import { useParams } from "react-router-dom";

const Sidebar = () => {
  const {
    getDisplayedUsers,
    showOnlineOnly,
    toggleOnlineFilter,
    fetchAllUsers,
    fetchOnlineUsers,
    selectedUser,
    setSelectedUser,
    unreadSenders,
  } = useMessageStore();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://deploy-back-3.onrender.com';
  const { userId,users } = useParams();


useEffect(() => {
    const users = getDisplayedUsers();
    if (userId) {
      const user = users.find((u) => u._id === userId);
      if (user) {
        setSelectedUser(user);
      }
    }
  }, [userId, users]);

  useEffect(() => {
  const fetchData = async () => {
    if (showOnlineOnly) {
      await fetchOnlineUsers();
    } else {
      await fetchAllUsers();
    }

    // Sélectionner l'user après le chargement
    const users = getDisplayedUsers();
    if (userId) {
      const user = users.find((u) => u._id === userId);
      if (user) setSelectedUser(user);
    }
  };
  fetchData();
}, [showOnlineOnly, userId]); // Ajouter userId aux dépendances

  const getLastSeen = (lastLogin) => {
  if (!lastLogin) return "Jamais connecté";
  
  try {
    const lastSeenDate = new Date(lastLogin);
    if (isNaN(lastSeenDate.getTime())) return "Date inconnue";

    return `Dernière connexion ${formatDistanceToNow(lastSeenDate, { 
      addSuffix: true, 
      locale: fr,
      includeSeconds: true
    })}`;
  } catch (error) {
    console.error("Erreur de formatage de date:", lastLogin, error);
    return "Dernière activité inconnue";
  }
};


const getProfileImage = (user) => {
  if (!user?.photo) return '/assets/default.png';
  
  // Retourner directement l'URL pour les providers externes
  if (user.photo.startsWith('http')) return user.photo;

  // Gestion des images locales avec cache-busting
  const separator = user.photo.includes('?') ? '&' : '?';
  return `${API_BASE_URL}/uploads/${user.photo}${separator}t=${Date.now()}`;
};

  return (
    <aside className="sidebarContainer">
      <div className="sidebarHeader">
        <div className="headerContent">
          <Users className="icon" />
          <h2 className="headerTitle">Messages</h2>
        </div>
        <label className="filterToggle">
          <input
            type="checkbox"
            checked={showOnlineOnly}
            onChange={toggleOnlineFilter}
          />
          <span className="toggleLabel">En ligne uniquement</span>
        </label>
      </div>

      <div className="userList">
        {getDisplayedUsers().map((user) => {
          const hasUnread = unreadSenders.has(user._id);
          
          return (
            <div
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`userItem ${selectedUser?._id === user._id ? 'selected' : ''}`}
            >
              <div className="avatarContainer">
                <Image
                  src={getProfileImage(user)}
                  alt={user.name}
                  roundedCircle
                  className="userAvatar"
                  onError={(e) => e.target.src = '/assets/default.png'}
                  referrerPolicy="no-referrer"
                />
                {user.isOnline && <div className="onlineIndicator" />}
              </div>
              
              <div className="userInfo">
                <div className="userMeta">
                  <p className={`userName ${hasUnread ? 'unread' : ''}`}>
                    {user.name}
                    {hasUnread && <span className="unreadDot" />}
                  </p>
                  {user.isAdmin && <Badge bg="primary">Admin</Badge>}
                </div>
                
{!user.isOnline && user.lastLogin && (
  <span className="lastSeen">
    {getLastSeen(user.lastLogin)}
  </span>
)}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;