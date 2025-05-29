import { Modal, Button } from 'react-bootstrap';
import { useEffect } from 'react';
import { FaRegComment, FaRegHeart, FaHeart, FaArrowLeft } from 'react-icons/fa';
import useCommunityStore from '../store/communityStore';
import "./FavoritesModal.css";

const FavoritesModal = () => {
  const {
    showFavoritesModal,
    setShowFavoritesModal,
    userInfo,
    posts,
    fetchPosts,
    selectedPost,
    setSelectedPost,
    likePost,
    
  } = useCommunityStore();

  // Au moment d'ouverture de la modal, recharge les posts et réinitialise le post sélectionné
  useEffect(() => {
    if (showFavoritesModal) {
      fetchPosts();
      // On s'assure de vider le post sélectionné pour afficher la liste
      setSelectedPost(null);
    }
  }, [showFavoritesModal]);

  // Filtrer les posts favoris
  const favoritePosts = posts.filter(post =>
    post.favorites?.includes(userInfo?._id)
  );

  // Ouvrir la vue détaillée d'un post (si on clique sur la carte hors icônes)
  const handlePostClick = (post) => {
    setSelectedPost(post);
  };

  // Lors du clic sur l'icône commentaire :
  // On met à jour le post sélectionné et on ferme la modal afin que
  // le CommentModal (rendu dans Community) se déclenche
  const handleOpenComments = (e, post) => {
    e.stopPropagation(); // Empêche l'ouverture de la vue détaillée
    setSelectedPost(post);
    setShowFavoritesModal(false);
  };

  // Action "like" dans la vue détail
  const handleLike = async (post) => {
    await likePost(post._id);
    // Recharge les posts pour mettre à jour le post sélectionné
    const updatedPosts = await fetchPosts();
    const updatedPost = updatedPosts.find(p => p._id === post._id);
    setSelectedPost(updatedPost);
  };

  // Dans la vue détail, on ferme la modal pour laisser place au CommentModal
  const handleCommentInDetail = (post) => {
    setSelectedPost(post);
    setShowFavoritesModal(false);
  };

  // Retour à la liste depuis la vue détail
  const handleBack = () => {
    setSelectedPost(null);
  };

  // Fermeture de la modal des favoris
  const handleClose = () => {
    setSelectedPost(null);
    setShowFavoritesModal(false);
  };

  return (
    <Modal 
      show={showFavoritesModal} 
      onHide={handleClose}
      size="lg"
      centered
       dialogClassName="favorites-modal-dialog centered-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {selectedPost ? "Détail du post" : "Vos posts favoris"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
        {selectedPost ? (
          // Vue Détail
          <div className="post-detail">
            <Button variant="link" onClick={handleBack} className="mb-2">
              <FaArrowLeft /> Retour
            </Button>
            <div className="d-flex align-items-center mb-2">
              <img
                src={selectedPost.user?.photo || "/default.png"}
                alt="User"
                className="rounded-circle me-2"
                width="35"
                height="35"
              />
              <div>
                <strong>{selectedPost.user?.nom}</strong>
                <div className="text-muted small">
                  {new Date(selectedPost.date).toLocaleDateString()}
                </div>
              </div>
            </div>
            <p>{selectedPost.content}</p>
            <div className="d-flex gap-3 small text-muted mb-3">
              <span 
                className="cursor-pointer"
                onClick={() => handleLike(selectedPost)}
                style={{
                  color: selectedPost.likedBy?.includes(userInfo?._id) ? '#ff0000' : '#65676B',
                  cursor: 'pointer'
                }}
              >
                {selectedPost.likedBy?.includes(userInfo?._id)
                  ? <FaHeart className="me-1" />
                  : <FaRegHeart className="me-1" />}
                {selectedPost.likes || 0}
              </span>
              <span 
                className="cursor-pointer"
                onClick={() => handleCommentInDetail(selectedPost)}
                style={{ color: '#65676B', cursor: 'pointer' }}
              >
                <FaRegComment className="me-1" />
                {selectedPost.comments?.length || 0}
              </span>
            </div>
          </div>
        ) : (
          // Vue Liste
          <>
            {favoritePosts.length === 0 ? (
              <div className="text-center py-3">
                Pas de posts favoris pour le moment.
              </div>
            ) : (
              favoritePosts.map(post => (
                <div 
                  key={post._id} 
                  className="bg-light p-3 rounded mb-3 cursor-pointer post-card"
                  onClick={() => handlePostClick(post)}
                >
                  <div className="d-flex align-items-center mb-2">
                    <img
                      src={post.user?.photo || "/default.png"}
                      alt="User"
                      className="rounded-circle me-2"
                      width="35"
                      height="35"
                    />
                    <div>
                      <strong>{post.user?.nom}</strong>
                      <div className="text-muted small">
                        {new Date(post.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <p className="mb-1">{post.content}</p>
                  <div className="d-flex gap-3 small text-muted">
                    <span>
                      {post.likedBy?.includes(userInfo?._id)
                        ? <FaHeart className="me-1" />
                        : <FaRegHeart className="me-1" />}
                      {post.likes || 0}
                    </span>
                    <span 
                      onClick={(e) => handleOpenComments(e, post)}
                      style={{ cursor: 'pointer' }}
                    >
                      <FaRegComment className="me-1" />
                      {post.comments?.length || 0}
                    </span>
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default FavoritesModal;
