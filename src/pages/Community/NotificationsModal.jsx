import { useState } from 'react';
import { Modal, Badge, ListGroup, Spinner, Button, Image } from 'react-bootstrap';
import useCommunityStore from '../store/communityStore';
import { formatDistanceToNow } from 'date-fns';
import fr from 'date-fns/locale/fr';
import "./NotificationsModal.css";

const NotificationModal = () => {
  const {
    showNotifications,
    setShowNotifications,
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    fetchNotifications,
    setSelectedPost,
    setNotificationTarget,
    fetchPosts
  } = useCommunityStore();
  
  const [isMarking, setIsMarking] = useState(false);
  const [expandedPosts, setExpandedPosts] = useState(new Set());
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://deploy-back-3.onrender.com';

  const handleNotificationClick = async (notification) => {
    try {
      await Promise.all([fetchPosts(), fetchNotifications()]);

      if (!notification.read) {
        await markAsRead([notification._id]);
      }

      const targetPost = await fetchPosts().then(posts => 
        posts.find(p => p._id === notification.post?._id)
      );

      if (!targetPost) throw new Error('Post non trouvé');

      setSelectedPost(targetPost);
      setNotificationTarget({
        postId: targetPost._id,
        commentId: notification.metadata?.commentId,
        replyId: notification.metadata?.replyId
      });

    } catch (error) {
      console.error('Erreur de navigation:', error);
      fetchNotifications();
    } finally {
      setShowNotifications(false);
    }
  };

  const cleanImageUrl = (url) => {
    if (!url || url.includes('default-avatar.png')) 
      return `${API_BASE_URL}/default-avatar.png`;
    return url.startsWith('http') ? url : `${API_BASE_URL}/uploads/${url}`;
  };

  const getTimeAgo = (date) => {
    try {
      return formatDistanceToNow(new Date(date), { 
        addSuffix: true, 
        locale: fr 
      });
    } catch {
      return 'Date invalide';
    }
  };

  const renderNotificationContent = (notification) => {
    const maxPreviewLength = 150;
    const isExpanded = expandedPosts.has(notification._id);
    const content = notification.post?.content || '';
    // const imageUrl = cleanImageUrl(notification.post?.image);

    return (
      <div className="mt-2">
        {/* {imageUrl && (
          <Image
            src={imageUrl}
            className="img-fluid rounded mb-2"
            alt="Contenu du post"
            style={{ maxHeight: '200px', objectFit: 'cover' }}
            onError={(e) => {
              e.target.src = `${API_BASE_URL}/default-post.png`;
            }}
          />
        )} */}

        {content && (
          <div className="bg-light rounded p-2 position-relative">
            <div className={`post-content ${!isExpanded ? 'text-preview' : ''}`}>
              {content.split(' ').map((word, index) =>
                word.startsWith('#') ? (
                  <span key={index} className="text-primary">{word} </span>
                ) : (
                  <span key={index}>{word} </span>
                )
              )}
            </div>

            {content.length > maxPreviewLength && (
              <Button
                variant="link"
                className="p-0 text-decoration-none"
                onClick={() => setExpandedPosts(prev => {
                  const newSet = new Set(prev);
                  newSet.has(notification._id) ? newSet.delete(notification._id) : newSet.add(notification._id);
                  return newSet;
                })}
              >
                {isExpanded ? 'Voir moins' : 'Voir plus'}
              </Button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Modal
    show={showNotifications}
    onHide={() => setShowNotifications(false)}
    centered
    backdropClassName="notification-backdrop"
    dialogClassName="notification-dialog"
  >
    {/* Modified Header Structure */}
    <Modal.Header className="border-0 pb-0">
      <div className="d-flex flex-column w-100">
        {/* Title and Close Button Row */}
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="m-0 d-flex align-items-center">
            Notifications
            {unreadCount > 0 && (
              <Badge pill bg="danger" className="ms-2">
                {unreadCount}
              </Badge>
            )}
          </h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowNotifications(false)}
            aria-label="Close"
          />
        </div>

        {/* Separator Line */}
        <hr className="mt-0 mb-2" />

        {/* Mark All as Read Button */}
        <div className="d-flex justify-content-end">
          <Button
            variant="link"
            onClick={async () => {
              setIsMarking(true);
              await markAllAsRead();
              setIsMarking(false);
            }}
            disabled={unreadCount === 0 || isMarking}
            className="text-primary p-0"
          >
            {isMarking ? (
              <Spinner animation="border" size="sm" />
            ) : (
              'Tout marquer comme lu'
            )}
          </Button>
        </div>
      </div>
    </Modal.Header>

      <Modal.Body className="p-0">
        <ListGroup variant="flush" className="notification-list" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {notifications.map(notification => (
            <ListGroup.Item
              key={notification._id}
              action
              className={`p-3 d-flex align-items-start border-bottom ${!notification.read ? 'unread-notification' : ''}`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="position-relative me-2">
                <Image
                  src={cleanImageUrl(notification.sender?.photo)}
                  alt={notification.sender?.nom || 'Utilisateur'}
                  roundedCircle
                  width={40}
                  height={40}
                  style={{ 
                    objectFit: 'cover',
                    minWidth: '40px',
                    minHeight: '40px'
                  }}
                  onError={(e) => {
                    e.target.src = `${API_BASE_URL}/default-avatar.png`;
                    e.target.onerror = null;
                  }}
                />
                {!notification.read && (
                  <div className="position-absolute top-0 end-0">
                    <div className="bg-primary rounded-circle" style={{ width: 10, height: 10, border: '2px solid white' }} />
                  </div>
                )}
              </div>

              <div className="flex-grow-1">
                <div className="d-flex justify-content-between align-items-start">
                  <p className="mb-1 small">
                    <strong>
                      {notification.sender?.nom || 'Utilisateur inconnu'}
                    </strong>
                    {' '}
                    {notification.type === 'like' && 'a aimé votre publication'}
                    {notification.type === 'comment' && 'a commenté votre publication'}
                    {notification.type === 'reply' && 'a répondu à votre commentaire'}
                  </p>
                  <span className="text-muted small">
                    {getTimeAgo(notification.createdAt)}
                  </span>
                </div>
                
                {renderNotificationContent(notification)}
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Modal.Body>
    </Modal>
  );
};

export default NotificationModal;