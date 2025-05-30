import { useState, useEffect } from "react";
import { Modal, Form, Badge, Button, ListGroup, Image, Spinner } from "react-bootstrap";
import { 
  FaEdit, FaTrashAlt, FaCheck, FaReply, 
  FaSmile, FaRegHeart, FaHeart, FaRegComment,
  FaTimes
} from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";
import useCommunityStore from "../store/communityStore";
import { jwtDecode } from "jwt-decode";
import "./CommentModal.css";

const CommentModal = ({ show, handleClose, post, setSelectedPost }) => {
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [activeReplyCommentId, setActiveReplyCommentId] = useState(null);
  const [showEmojiPickerComment, setShowEmojiPickerComment] = useState(false);
  const [showEmojiPickerReply, setShowEmojiPickerReply] = useState(false);

  const { 
    userInfo,
    fetchUserInfo,
    addComment, 
    updateComment, 
    deleteComment, 
    addReply, 
    updateReply, 
    deleteReply,
    fetchPosts,
    likePost,
    isLoading
  } = useCommunityStore();

  const token = localStorage.getItem('token');
  const currentUserId = token ? jwtDecode(token)?.id : null;
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://deploy-back-3.onrender.com';
  const { notificationTarget, clearNotificationTarget } = useCommunityStore();
  
  useEffect(() => {
    const handleNavigation = async () => {
      if (!post || !notificationTarget) return;
  
      // Attendre le rendu des commentaires
      await new Promise(resolve => setTimeout(resolve, 300));
  
      let element;
      
      if (notificationTarget.replyId) {
        element = document.getElementById(`reply-${notificationTarget.replyId}`);
        // Développer le commentaire parent
        const commentElement = element?.closest('.comment-container');
        if (commentElement) {
          commentElement.classList.add('expanded');
        }
      } else if (notificationTarget.commentId) {
        element = document.getElementById(`comment-${notificationTarget.commentId}`);
      } else {
        // Pour les likes, simplement scroll vers le haut du post
        element = document.getElementById(`post-${post._id}`);
      }
  
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest'
        });
        
        // Animation de surbrillance
        element.classList.add('highlight-target');
        setTimeout(() => element.classList.remove('highlight-target'), 2000);
      }
  
      clearNotificationTarget();
    };
  
    handleNavigation();
  }, [post, notificationTarget]);

  useEffect(() => {
    if (currentUserId) fetchUserInfo(currentUserId);
  }, [currentUserId, fetchUserInfo]);

  // Si aucun post n'est fourni, ne rien afficher
  if (!post) return null;

  // Valeurs par défaut
  const currentUserPhoto = userInfo?.photo || `${API_BASE_URL}/default.png`;
  const postUser = post?.user || {};
  const comments = post?.comments || [];

  // Fonction pour effectuer une action puis mettre à jour le post
  const handleAction = async (action) => {
    try {
      await action();
      const updatedPosts = await fetchPosts();
      const updatedPost = updatedPosts.find(p => p._id === post._id);
      if (updatedPost) setSelectedPost(updatedPost);
    } catch (error) {
      console.error("Erreur d'action:", error);
    }
  };

  // Ajout d'un commentaire
  const handleAddComment = async () => {
    if (commentText.trim()) {
      await handleAction(() => addComment(post._id, commentText));
      setCommentText("");
      setShowEmojiPickerComment(false);
    }
  };

  // Edition d'un commentaire
  const handleEditComment = async (commentId) => {
    if (commentText.trim()) {
      await handleAction(() => updateComment(post._id, commentId, commentText));
      setEditingCommentId(null);
      setCommentText("");
    }
  };

  // Suppression d'un commentaire
  const handleDeleteComment = async (commentId) => {
    if (window.confirm("Supprimer ce commentaire ?")) {
      await handleAction(() => deleteComment(post._id, commentId));
    }
  };

  // Ajout d'une réponse
  const handleAddReply = async (commentId) => {
    if (replyText.trim()) {
      await handleAction(() => addReply(post._id, commentId, replyText));
      setActiveReplyCommentId(null);
      setReplyText("");
      setShowEmojiPickerReply(false);
    }
  };

  // Edition d'une réponse
  const handleEditReply = async (commentId, replyId) => {
    if (replyText.trim()) {
      await handleAction(() => updateReply(post._id, commentId, replyId, replyText));
      setEditingReplyId(null);
      setReplyText("");
    }
  };

  // Suppression d'une réponse
  const handleDeleteReply = async (commentId, replyId) => {
    if (window.confirm("Supprimer cette réponse ?")) {
      await handleAction(() => deleteReply(post._id, commentId, replyId));
    }
  };

  // Fonction pour ajouter un emoji dans le commentaire
  const addEmojiToComment = (emojiData) => setCommentText(prev => prev + emojiData.emoji);
  const addEmojiToReply = (emojiData) => setReplyText(prev => prev + emojiData.emoji);

  // --- Fonction de like/dilike sur le post principal ---
  const handleLike = async () => {
    try {
      await likePost(post._id);
      const updatedPosts = await fetchPosts();
      const updatedPost = updatedPosts.find(p => p._id === post._id);
      if (updatedPost) setSelectedPost(updatedPost);
    } catch (error) {
      console.error("Erreur lors du like/dilike :", error);
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      
      backdropClassName="notification-backdrop"
      dialogClassName="comment-dialog"
      
    >
      <Modal.Header className="border-0 pb-0">
        <div className="d-flex justify-content-between w-100 align-items-center">
          <h5 className="m-0 d-flex align-items-center">
            💬 Commentaires
            <Badge pill bg="primary" className="ms-2">
              {comments.length}
            </Badge>
          </h5>
          <Button
            variant="link"
            onClick={handleClose}
            className="p-0 text-muted"
          >
            <FaTimes />
          </Button>
        </div>
      </Modal.Header>

      <Modal.Body className="p-0">
        <div className="d-flex flex-column" style={{ height: '70vh' }}>
          {/* Post Principal */}
          <ListGroup.Item className="p-3 border-bottom bg-white">
            <div className="d-flex gap-2 align-items-start">
              <Image
                src={postUser?.photo || `${API_BASE_URL}/default.png`}
                alt="Auteur du post"
                roundedCircle
                width={40}
                height={40}
                style={{ 
                  objectFit: 'cover',
                  minWidth: '40px',
                  minHeight: '40px',
                  backgroundColor: '#f0f2f5'
                }}
                onError={(e) => {
                  e.target.src = `${API_BASE_URL}/default-avatar.png`;
                  e.target.style.backgroundColor = '#f0f2f5';
                }}
              />
              <div className="flex-grow-1">
                <div className="d-flex align-items-center gap-2 mb-1">
                  <strong>{postUser?.nom || 'Utilisateur inconnu'}</strong>
                  {postUser?.role === 'professional' && <Badge bg="info">Pro</Badge>}
                  <span className="text-muted small">
                    {new Date(post?.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="mb-2">{post?.content}</p>
                <div className="d-flex gap-3 text-muted small">
                  <span 
                    onClick={handleLike}
                    style={{ 
                      cursor: 'pointer', 
                      color: post.likedBy?.includes(userInfo?._id) ? '#ff0000' : '#65676B' 
                    }}
                  >
                    {post.likedBy?.includes(userInfo?._id) ? (
                      <FaHeart className="me-1" />
                    ) : (
                      <FaRegHeart className="me-1" />
                    )}
                    {post?.likes || 0}
                  </span>
                  <span>
                    <FaRegComment className="me-1" />
                    {comments.length}
                  </span>
                </div>
              </div>
            </div>
          </ListGroup.Item>

          {/* Liste des Commentaires */}
          <ListGroup 
            variant="flush" 
            className="flex-grow-1 overflow-auto comment-list"
          >
            {comments.length === 0 ? (
              <ListGroup.Item className="text-center text-muted py-4">
                Aucun commentaire pour le moment
              </ListGroup.Item>
            ) : (
              comments.map((comment) => {
                const commentUser = comment?.user || {};
                const replies = comment?.replies || [];
                return (
                  <ListGroup.Item key={comment._id} id={`comment-${comment._id}`} className="p-3 border-bottom">
                    <div className="d-flex gap-2 align-items-start">
                      <Image
                        src={commentUser?.photo || `${API_BASE_URL}/default-avatar.png`}
                        alt="Auteur du commentaire"
                        roundedCircle
                        width={40}
                        height={40}
                        style={{ 
                          objectFit: 'cover',
                          minWidth: '40px',
                          minHeight: '40px',
                          backgroundColor: '#f0f2f5'
                        }}
                        onError={(e) => {
                          e.target.src = `${API_BASE_URL}/default-avatar.png`;
                          e.target.style.backgroundColor = '#f0f2f5';
                        }}
                      />
                      <div className="flex-grow-1">
                        <div className="bg-light rounded-3 p-2">
                          <div className="d-flex align-items-center gap-2 mb-1">
                            <strong>{commentUser?.nom || 'Utilisateur inconnu'}</strong>
                            <span className="text-muted small">
                              {new Date(comment?.date).toLocaleDateString()}
                            </span>
                            {commentUser?._id === currentUserId && (
                              <div className="ms-auto d-flex gap-2">
                                <Button
                                  variant="link"
                                  className="p-0"
                                  onClick={() => { 
                                    setEditingCommentId(comment._id); 
                                    setCommentText(comment.text); 
                                  }}
                                >
                                  <FaEdit className="text-muted" />
                                </Button>
                                <Button
                                  variant="link"
                                  className="p-0"
                                  onClick={() => handleDeleteComment(comment._id)}
                                >
                                  <FaTrashAlt className="text-danger" />
                                </Button>
                              </div>
                            )}
                          </div>
                          {editingCommentId === comment._id ? (
                            <div className="d-flex gap-2 align-items-center mt-2">
                              <Form.Control
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                className="flex-grow-1"
                              />
                              <Button
                                variant="success"
                                onClick={() => handleEditComment(comment._id)}
                              >
                                <FaCheck />
                              </Button>
                            </div>
                          ) : (
                            <p className="mb-1">{comment.text}</p>
                          )}
                        </div>

                        {/* Réponses */}
                        <div className="ms-4 mt-3">
                          <div className="d-flex align-items-center mt-2">
                            <Button
                              variant="link"
                              className="p-0 text-muted"
                              onClick={() => setActiveReplyCommentId(comment._id)}
                            >
                              <FaReply className="me-1" /> Répondre
                            </Button>
                            <span className="text-muted small ms-2">
                              {replies.length > 0 && `${replies.length} réponse${replies.length > 1 ? 's' : ''}`}
                            </span>
                          </div>
                          {replies.map((reply) => {
                            const replyUser = reply?.user || {};
                            return (
                              <div key={reply._id} id={`reply-${reply._id}`} className="mb-3 mt-2">
                                <div className="d-flex gap-2 align-items-start">
                                  <Image
                                    src={replyUser?.photo || `${API_BASE_URL}/default-avatar.png`}
                                    alt="Auteur de la réponse"
                                    roundedCircle
                                    width={32}
                                    height={32}
                                    style={{ 
                                      objectFit: 'cover',
                                      minWidth: '32px',
                                      minHeight: '32px',
                                      backgroundColor: '#f0f2f5'
                                    }}
                                    onError={(e) => {
                                      e.target.src = `${API_BASE_URL}/default-avatar.png`;
                                      e.target.style.backgroundColor = '#f0f2f5';
                                    }}
                                  />
                                  <div className="flex-grow-1">
                                    <div className="bg-light rounded-3 p-2">
                                      <div className="d-flex align-items-center gap-2 mb-1">
                                        <strong>{replyUser?.nom || 'Utilisateur inconnu'}</strong>
                                        <span className="text-muted small">
                                          {new Date(reply?.date).toLocaleDateString()}
                                        </span>
                                        {replyUser?._id === currentUserId && (
                                          <div className="ms-auto d-flex gap-2">
                                            <Button
                                              variant="link"
                                              className="p-0"
                                              onClick={() => { 
                                                setEditingReplyId(reply._id); 
                                                setReplyText(reply.text); 
                                              }}
                                            >
                                              <FaEdit className="text-muted" />
                                            </Button>
                                            <Button
                                              variant="link"
                                              className="p-0"
                                              onClick={() => handleDeleteReply(comment._id, reply._id)}
                                            >
                                              <FaTrashAlt className="text-danger" />
                                            </Button>
                                          </div>
                                        )}
                                      </div>
                                      {editingReplyId === reply._id ? (
                                        <div className="d-flex gap-2 align-items-center mt-2">
                                          <Form.Control
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            className="flex-grow-1"
                                          />
                                          <Button
                                            variant="success"
                                            onClick={() => handleEditReply(comment._id, reply._id)}
                                          >
                                            <FaCheck />
                                          </Button>
                                        </div>
                                      ) : (
                                        <p className="mb-0">{reply.text}</p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}

                          {activeReplyCommentId === comment._id && (
                            <div className="d-flex gap-2 mt-3 align-items-start">
                              <Image
                                src={currentUserPhoto}
                                alt="Votre profil"
                                roundedCircle
                                width={32}
                                height={32}
                                style={{ 
                                  objectFit: 'cover',
                                  minWidth: '32px',
                                  minHeight: '32px',
                                  backgroundColor: '#f0f2f5'
                                }}
                                onError={(e) => {
                                  e.target.src = `${API_BASE_URL}/default-avatar.png`;
                                  e.target.style.backgroundColor = '#f0f2f5';
                                }}
                              />
                              <div className="flex-grow-1 position-relative">
                                <Form.Control
                                  as="textarea"
                                  rows={3}
                                  placeholder="Écrire une réponse..."
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value)}
                                  style={{ borderRadius: '20px', resize: 'none' }}
                                />
                                <Button
                                  variant="link"
                                  className="position-absolute end-0 top-50 translate-middle-y"
                                  onClick={() => setShowEmojiPickerReply(!showEmojiPickerReply)}
                                >
                                  <FaSmile style={{ color: '#65676B' }} />
                                </Button>
                                {showEmojiPickerReply && (
                                  <div className="position-absolute end-0 mb-2" style={{ zIndex: 1000 }}>
                                    <EmojiPicker 
                                      onEmojiClick={addEmojiToReply} 
                                      width={300} 
                                      height={350}
                                      previewConfig={{ showPreview: false }}
                                    />
                                  </div>
                                )}
                                <div className="d-flex gap-2 mt-2 justify-content-end">
                                  <Button
                                    variant="secondary"
                                    onClick={() => setActiveReplyCommentId(null)}
                                  >
                                    Annuler
                                  </Button>
                                  <Button
                                    variant="primary"
                                    onClick={() => handleAddReply(comment._id)}
                                    disabled={!replyText.trim()}
                                  >
                                    Répondre
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </ListGroup.Item>
                );
              })
            )}
          </ListGroup>

          {/* Formulaire de Commentaire */}
          <div className="p-3 bg-white border-top sticky-bottom">
            <div className="d-flex gap-2 align-items-center">
              <Image
                src={currentUserPhoto}
                alt="Votre profil"
                roundedCircle
                width={40}
                height={40}
                style={{ 
                  objectFit: 'cover',
                  minWidth: '40px',
                  minHeight: '40px',
                  backgroundColor: '#f0f2f5'
                }}
                onError={(e) => {
                  e.target.src = `${API_BASE_URL}/default-avatar.png`;
                  e.target.style.backgroundColor = '#f0f2f5';
                }}
              />
              <div className="flex-grow-1 position-relative">
                <Form.Control
                  as="textarea"
                  rows={2}
                  placeholder="Écrire un commentaire..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  style={{ borderRadius: '20px', resize: 'none' }}
                />
                <Button
                  variant="link"
                  className="position-absolute end-0 top-50 translate-middle-y"
                  onClick={() => setShowEmojiPickerComment(!showEmojiPickerComment)}
                >
                  <FaSmile style={{ color: '#65676B' }} />
                </Button>
                {showEmojiPickerComment && (
                  <div className="position-absolute end-0 mb-2" style={{ zIndex: 1000 }}>
                    <EmojiPicker 
                      onEmojiClick={addEmojiToComment} 
                      width={300} 
                      height={350}
                      previewConfig={{ showPreview: false }}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="d-flex justify-content-end mt-2">
              <Button 
                variant="primary"
                onClick={handleAddComment}
                disabled={!commentText.trim() || isLoading}
                style={{ borderRadius: '20px', padding: '5px 20px' }}
              >
                {isLoading ? <Spinner size="sm" /> : 'Publier'}
              </Button>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default CommentModal;
