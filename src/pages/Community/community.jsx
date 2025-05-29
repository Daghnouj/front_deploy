import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Community.css";
import {
  FaPlus,
  FaRegComment,
  FaRegHeart,
  FaHeart,
  FaRegBookmark,
  FaBookmark
} from "react-icons/fa";
import useCommunityStore from "../store/communityStore";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { jwtDecode } from "jwt-decode";
import CommentModal from "./CommentModal";
import { Badge } from "react-bootstrap";
import NotificationsModal from "./NotificationsModal";
import PostActionsDropdown from "./PostActionsDropdown";
import FavoritesModal from "./FavoritesModal";
import { useNavigate } from "react-router-dom";
import useMessageStore from "../store/useMessageStore";

const Community = () => {
  const navigate = useNavigate();
  const {
    posts,
    newPostContent,
    userInfo,
    setNewPostContent,
    setUserId,
    fetchPosts,
    fetchUserInfo,
    createPost,
    likePost,
    isLoading,
    error,
    setShowNotifications,
    unreadCount,
    toggleFavorite,
    popularHashtags,
    setShowFavoritesModal,
    fetchPopularHashtags,
    selectedPost,
    setSelectedPost,
  } = useCommunityStore();

  const [showModal, setShowModal] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [hoveredUser, setHoveredUser] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [hoverTimeout, setHoverTimeout] = useState(null);

const handleDiscuss = async (user) => {
  try {
    // Charger les utilisateurs avant la navigation
    await useMessageStore.getState().fetchAllUsers()
    navigate(`/prof/messages/users/${user._id}`)
    setHoveredUser(null)
  } catch (error) {
    console.error("Erreur lors de la navigation :", error)
  }
}

  const handleAvatarHover = (e, user) => {
    if (!user) return;
    
    const rect = e.target.getBoundingClientRect();
    setHoverPosition({
      x: rect.right + 10,
      y: rect.top + window.scrollY - 10
    });
    
    setHoveredUser(user);
    clearTimeout(hoverTimeout);
  };

  const handleAvatarLeave = () => {
    setHoverTimeout(
      setTimeout(() => {
        setHoveredUser(null);
      }, 300)
    );
  };

  const handleCardHover = () => {
    clearTimeout(hoverTimeout);
  };

  const handleCardLeave = () => {
    setHoveredUser(null);
  };

  useEffect(() => {
    const { initializeSocket, fetchNotifications, cleanupSocket } = useCommunityStore.getState();
    const token = localStorage.getItem("token");

    const init = async () => {
      if (token) {
        try {
          await initializeSocket(token);
          await fetchNotifications();
        } catch (error) {
          console.error("Initialization error:", error);
        }
      }
    };

    init();
    return () => {
      cleanupSocket();
      useCommunityStore.setState({ showNotifications: false });
    };
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const decoded = jwtDecode(token);
          if (decoded?.id) {
            setUserId(decoded.id);
            await fetchUserInfo(decoded.id);
          }
        }
        await fetchPosts();
        await fetchPopularHashtags();
      } catch (error) {
        console.error("Erreur initialisation:", error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (selectedPost) {
      const freshPost = posts.find((p) => p._id === selectedPost._id);
      if (freshPost) setSelectedPost(freshPost);
    }
  }, [posts]);

  const handleCreatePost = async () => {
    try {
      await createPost();
      setShowModal(false);
    } catch (error) {
      console.error("Post creation error:", error);
    }
  };

  useEffect(() => {
    if (searchQuery.trim()) {
      if (searchTimeout) clearTimeout(searchTimeout);
      setSearchTimeout(
        setTimeout(() => {
          useCommunityStore.getState().fetchSearchPosts(searchQuery);
        }, 500)
      );
    }
  }, [searchQuery]);

  const displayedPosts = searchQuery.trim()
    ? useCommunityStore.getState().searchedPosts
    : showFavorites
      ? posts.filter((post) => post.favorites?.includes(userInfo?._id))
      : posts;

  return (
    <div className="container py-4 text-center mt-5">
      {hoveredUser && (
        <div 
          className="user-hover-card"
          style={{
            left: hoverPosition.x,
            top: hoverPosition.y,
          }}
          onMouseEnter={handleCardHover}
          onMouseLeave={handleCardLeave}
        >
          <div className="d-flex align-items-center gap-2 mb-2">
            <img
              src={hoveredUser.photo || "/default-avatar.png"}
              alt={hoveredUser.nom}
              className="rounded-circle"
              width="50"
              height="50"
              onError={(e) => e.target.src = "/default-avatar.png"}
              referrerPolicy="no-referrer"
            />
            <div>
              <h6 className="m-0">{hoveredUser.nom}</h6>
              {hoveredUser.role === "professional" && (
                <small className="text-muted">Professional</small>
              )}
            </div>
          </div>
          <button 
            className="btn btn-primary btn-sm"
            onClick={() => handleDiscuss(hoveredUser)}
          >
            Discuter
          </button>
        </div>
      )}

      <NotificationsModal />
      <FavoritesModal />

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create New Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <textarea
            className="form-control mb-3"
            placeholder="What's on your mind?"
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            rows={5}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleCreatePost}
            disabled={isLoading || !newPostContent.trim()}
          >
            {isLoading ? "Posting..." : "Add Post"}
          </Button>
        </Modal.Footer>
      </Modal>

      <CommentModal
        show={!!selectedPost}
        handleClose={() => {
          setSelectedPost(null);
          fetchPosts();
        }}
        post={selectedPost}
        setSelectedPost={setSelectedPost}
      />

      {error && (
        <div className="alert alert-danger">
          Error: {error}
          <button
            className="btn-close float-end"
            onClick={() => useCommunityStore.getState().clearError()}
          />
        </div>
      )}

      <div className="d-flex justify-content-center mt-5">
        <img
          src="src/assets/community.png"
          alt="Community"
          className="img-fluid rounded shadow-lg custom-img rounded-4 w-100"
        />
      </div>

      <div className="row mt-4">
        <div className="col-lg-3 col-md-4 col-12 p-3">
          <div className="p-3 rounded-5 sidebar-section st">
            <button
              className="btn add-post-btn w-100 d-flex align-items-center justify-content-center mb-2 rounded-5"
              onClick={() => setShowModal(true)}
              disabled={isLoading}
            >
              <FaPlus className="me-2" /> Add a Post
            </button>
            <hr className="divider" />
            <p className="text-dark cursor-pointer" onClick={() => setShowFavoritesModal(true)}>Favorite Posts</p>
            <p
              className="text-dark cursor-pointer"
              onClick={() => {
                setShowNotifications(true);
                useCommunityStore.getState().fetchNotifications();
              }}
            >
              Notifications {unreadCount > 0 && <Badge bg="danger">{unreadCount}</Badge>}
            </p>
          </div>
        </div>

        <div className="col-lg-6 col-md-8 col-12 py-3 posts-container rounded-5" id="posts-scroll-container">
          {isLoading && posts.length === 0 ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div>
              {displayedPosts.length === 0 ? (
                <div className="alert alert-info">
                  {searchQuery.trim()
                    ? "No posts match your search."
                    : showFavorites
                      ? "No favorite posts yet."
                      : "No posts available. Be the first to post!"}
                </div>
              ) : (
                displayedPosts.map((post) => (
                  <div key={post._id} className="bg-white p-3 rounded-4 shadow-lg text-start mt-3 position-relative">
                    <div className="position-absolute" style={{ top: '15px', right: '15px' }}>
                      <PostActionsDropdown post={post} userInfo={userInfo} />
                    </div>

                    <div className="d-flex align-items-center">
                      <img
                        src={post.user?.photo || "/default-avatar.png"}
                        alt="User"
                        className="rounded-circle me-2"
                        width="40"
                        height="40"
                        style={{ objectFit: "cover" }}
                        onError={(e) => e.target.src = "/default-avatar.png"}
                        onMouseEnter={(e) => handleAvatarHover(e, post.user)}
                        onMouseLeave={handleAvatarLeave}
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <strong>{post.user?.nom || userInfo?.nom || `User ${post.owner}`}</strong>
                        {post.user?.role === "professional" && (
                          <span className="badge bg-info ms-2">Pro</span>
                        )}
                        <p className="text-muted small mb-0">
                          {new Date(post.date).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <p className="mt-2 fw-bold">{post.content}</p>

                    {post.hashtags?.length > 0 && (
                      <p className="text-primary small">
                        {post.hashtags.map((tag) => `#${tag}`).join(" ")}
                      </p>
                    )}

                    <div className="d-flex align-items-center mt-3 gap-4">
                      <div
                        className="d-flex align-items-center cursor-pointer"
                        onClick={async () => {
                          try {
                            await likePost(post._id);
                            await fetchPosts();
                          } catch (error) {
                            console.error("Erreur:", error);
                          }
                        }}
                        style={{
                          color: post.likedBy?.includes(userInfo?._id) ? "#ff0000" : "#65676B",
                          transition: "color 0.2s ease-in-out"
                        }}
                      >
                        {post.likedBy?.includes(userInfo?._id) ? (
                          <FaHeart className="me-1" />
                        ) : (
                          <FaRegHeart className="me-1" />
                        )}
                        <span>{post.likes || 0}</span>
                      </div>

                      <div
                        className="d-flex align-items-center cursor-pointer"
                        onClick={() => setSelectedPost(post)}
                        style={{ color: "#65676B" }}
                      >
                        <FaRegComment className="me-1" />
                        <span>{post.comments?.length || 0}</span>
                      </div>

                      <div
                        className="ms-auto cursor-pointer"
                        onClick={() => toggleFavorite(post._id)}
                        style={{
                          color: post.favorites?.includes(userInfo?._id) ? "#ffbf00" : "#65676B",
                          transition: "color 0.2s ease-in-out",
                          fontSize: "1.2rem"
                        }}
                      >
                        {post.favorites?.includes(userInfo?._id) ? (
                          <FaBookmark />
                        ) : (
                          <FaRegBookmark />
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="col-lg-3 col-md-12 col-12 p-3">
          <div className="st">
            <input
              type="text"
              className="form-control search-bar mb-2 rounded-5"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (!e.target.value.trim()) fetchPosts();
              }}
            />
            <div className="bg-primary p-3 rounded-5 text-white">
              <h5>Populaire Hashtags</h5>
              {popularHashtags.length === 0 ? (
                <div className="text-center small">Chargement des hashtags...</div>
              ) : (
                popularHashtags.map((hashtag) => (
                  <p
                    key={hashtag._id}
                    className="text-light mb-2 fs-5 hashtag-item"
                    onClick={() => setSearchQuery(`#${hashtag.name}`)}
                    style={{ cursor: "pointer" }}
                  >
                    #{hashtag.name}
                  </p>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;