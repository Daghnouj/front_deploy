import { useEffect, useState } from 'react';
import { Spinner, Alert, Dropdown } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useGalerieStore } from './store/useGalerieStore';
import 'bootstrap/dist/css/bootstrap.min.css';
import './galerie.css';
import g1 from "../assets/g1.jpeg";

const getYouTubeId = (url) => {
  const match = url.match(/[?&]v=([^&]+)/);
  return match ? match[1] : url.split('/').pop();
};

const Gallery = () => {
  const { user } = useAuth();
  const {
    topVideos,
    categoryVideos,
    selectedCategory,
    isLoading,
    error,
    fetchAllData,
    fetchCategoryVideos,
    incrementViews,
    localViewedVideos,
    setLocalViewedVideos,
    clearSelectedCategory
  } = useGalerieStore();

  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    "Toutes les catégories",
    "Bien-être Mental",
    "Gestion du Stress", 
    "Thérapies et Coaching",
    "Relations Sociales",
    "Développement Personnel"
  ];

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const activeVideos = selectedCategory ? categoryVideos : topVideos;
  const filteredVideos = activeVideos.filter(video =>
    video.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleVideoView = async (videoId) => {
    try {
      const targetVideo = [...topVideos, ...categoryVideos].find(v => v._id === videoId);
      const newViews = (targetVideo?.views || 0) + 1;
     
      incrementViews(videoId, newViews);
      setLocalViewedVideos(new Set([...localViewedVideos, videoId]));
 
      const config = user?.token
        ? { headers: { Authorization: `Bearer ${user.token}` } }
        : {};
 
      await axios.post(
        `https://deploy-back-3.onrender.com/api/galerie/${videoId}/view`,
        {},
        config
      );
    } catch (error) {
      console.error('Erreur:', error);
      await fetchAllData();
    }
  };

  return (

    <div className="container-fluid gal">
      <section className=' sec' style={{
        marginTop:'-15px',

      backgroundColor: '#4FB2E5',
      height: '282px', // Adjust height as needed
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <h1 style={{ color: 'white', fontSize: '40px', margin: 0, fontWeight: 'bold' }}>
        Your space for the mental health information
      </h1>
    </section>
      {/* Hero Section */}
      <div className='container mt-5'>
      <div className="row align-items-center mb-5 py-5">
        <div className="col-lg-6 mb-4 mb-lg-0">
          <h1 className="display-5 fw-bold mb-4 me-2">
            {topVideos[0]?.titre || "Ressources Santé Mentale"}
          </h1>
          <p className="lead text-muted mb-4 me-3">
            {topVideos[0]?.desc || "Des contenus experts pour votre bien-être mental et émotionnel"}
          </p>
        </div>
        
        <div className="col-lg-6">
          {topVideos[0] && (
            <div className="video-box shadow-lg rounded-3 overflow-hidden">
              <div className="ratio ratio-16x9">
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeId(topVideos[0].video)}`}
                  allowFullScreen
                  className="border-0"
                />
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
      
      <section className=' sec' style={{
      backgroundColor: '#FF8D50',
      height: '106px', // Adjust height as needed
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <h1 style={{ color: 'white', fontSize: '40px', margin: 0, fontWeight: 'bold' }}>
        Discover
      </h1>
    </section>
<div className='container mb-5'>
      {/* Search & Categories */}
      <div className="row mb-5 g-3 align-items-center justify-content-center mt-5">
        <div className="col-md-3 order-md-1">
          <div className="input-group input-group-lg">
            <input
              type="search"
              className="form-control border-dark rounded-5 py-2"
              placeholder="Rechercher des vidéos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{height:'53px',backgroundColor:'#ECECEC'}}
            />
          </div>
        </div>

        <div className="col-md-2 order-md-2 rounded-5">
          <Dropdown>
            <Dropdown.Toggle 
              variant={selectedCategory} 
              className="border-dark rounded-5 w-100 text-dark"
              id="category-dropdown"
              style={{height:'53px',backgroundColor:'#ECECEC'}}
            >
              {selectedCategory || "Catégories"}
            </Dropdown.Toggle>

            <Dropdown.Menu className="w-100">
              {categories.map((category) => (
                <Dropdown.Item 
                className="border-dark w-100 text-dark"
                  key={category}
                  onClick={() => {
                    if (category === "Toutes les catégories") {
                      fetchAllData();
                      clearSelectedCategory();
                    } else {
                      fetchCategoryVideos(category);
                    }
                  }}
                  active={
                    (category === "Toutes les catégories" && !selectedCategory) ||
                    selectedCategory === category
                  }
                >
                  {category}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      {/* Video Grid */}
      {isLoading && <div className="text-center my-5"><Spinner animation="border" /></div>}
      
      {error && (
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      )}

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mt-5">
        {filteredVideos.map((video) => (
          <div className="col" key={video._id}>
            <div 
              className="video-box h-100 shadow-sm"
              onClick={() => handleVideoView(video._id)}
            >
              <div className="ratio ratio-16x9">
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeId(video.video)}?modestbranding=1&rel=0&controls=1&autohide=1`}
                  allowFullScreen
                  className="border-0"
                />
              </div>
              <div className="p-3">
                <h5 className="video-title mb-2 fw-bold">{video.titre}</h5>
                <div className="d-flex justify-content-between text-muted small">
                  <span><i className="fas fa-eye me-1"></i>{video.viewCount}</span>
                  <span>
                    {new Date(video.createdAt).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

<div className="container mt-5">
  <div className="row mb-5">
    <div className="col-12 text-center mb-5">
      <h2 className="galg-main-title display-6 fw-bold mt-5">You can also read about</h2>
    </div>

    {/* Cards Section */}
<div className="row g-4 mb-5 ">
  {[1, 2, 3, 4].map((item) => (
    <div className="col-12 col-md-3 " key={item}>
      <div className="galg-card position-relative overflow-hidden rounded-4">
        <div className="galg-card-img-container position-relative h-100">
          <img 
            src={g1}
            alt="Article"
            className="galg-card-img"
          />
          <div className="galg-card-overlay position-absolute bottom-0 start-0 end-0 p-3">
            <h3 className="galg-card-title text-white text-center mb-5 fw-bold">Understanding Anxiety Disorders</h3>
          </div>
        </div>
      </div>
    </div>
  ))}
</div>

    {/* Read More Button */}
    <div className="col-12 text-center mt-4">
      <button 
        className="galg-readmore-btn btn btn-lg rounded-pill px-5 py-3"
        style={{
          backgroundColor: '#FF69B4',
          color: 'white',
          border: 'none'
        }}
      >
        Read More
      </button>
    </div>
  </div>
</div>
    </div>
  );
};

export default Gallery;