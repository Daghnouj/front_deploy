import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUpload, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import './admingalerie.css';

const api = axios.create({
  baseURL: 'https://deploy-back-3.onrender.com/api',
  withCredentials: true,
});

const getYouTubeId = (url) => {
  const match = url.match(/[?&]v=([^&]+)/);
  return match ? match[1] : url.split('/').pop();
};

const VideoGallery = () => {
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [newVideo, setNewVideo] = useState({
    titre: '',
    desc: '',
    categorie: '',
    video: ''
  });
  const [editData, setEditData] = useState({});
  const [errors, setErrors] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('');
  const videosPerPage = 6;

  const fetchVideos = async () => {
    try {
      const response = await api.get('/galerie');
      setVideos(response.data);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const validateForm = (data) => {
    const newErrors = {};
    if (!data.titre?.trim()) newErrors.titre = 'Title is required';
    if (!data.desc?.trim()) newErrors.desc = 'Description is required';
    if (!data.categorie?.trim()) newErrors.categorie = 'Category is required';
    if (!data.video?.trim()) newErrors.video = 'YouTube URL is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!validateForm(newVideo)) return;

    try {
      await api.post('/galerie', {
        titre: newVideo.titre,
        desc: newVideo.desc,
        categorie: newVideo.categorie,
        video: newVideo.video
      }, {
        headers: { 'Content-Type': 'application/json' }
      });
      fetchVideos();
      setShowUploadModal(false);
      setNewVideo({ titre: '', desc: '', categorie: '', video: '' });
      setErrors({});
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!selectedVideo || !validateForm(editData)) return;

    try {
      await api.put(`/galerie/${selectedVideo._id}`, {
        titre: editData.titre,
        desc: editData.desc,
        categorie: editData.categorie,
        video: editData.video
      }, {
        headers: { 'Content-Type': 'application/json' }
      });
      fetchVideos();
      setShowEditModal(false);
      setErrors({});
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  const handleDelete = async (videoId) => {
    if (!window.confirm('Are you sure you want to delete this video?')) return;
    try {
      await api.delete(`/galerie/${videoId}`);
      fetchVideos();
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const filteredVideos = selectedCategory
    ? videos.filter(video => video.categorie === selectedCategory)
    : videos;

  const indexOfLastVideo = page * videosPerPage;
  const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
  const currentVideos = filteredVideos.slice(indexOfFirstVideo, indexOfLastVideo);

  

  return (
    <div className="video-gallery-container">
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="page-title">Video Gallery</h1>
          <button 
            className="btn btn-primary"
            onClick={() => setShowUploadModal(true)}
          >
            <FaUpload className="me-2" /> New Video
          </button>
        </div>

        <div className="mb-4">
          <select 
            className="form-select"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Categories</option>
            <option value="Bien-être Mental">Mental Well-being</option>
            <option value="Gestion du Stress">Stress Management</option>
            <option value="Thérapies et Coaching">Therapies & Coaching</option>
            <option value="Relations Sociales">Social Relations</option>
            <option value="Développement Personnel">Personal Development</option>
          </select>
        </div>

        <div className="row g-4">
          {currentVideos.map((video) => (
            <div className="col-md-6 col-lg-4" key={video._id}>
              <div className="card h-100 shadow-sm">
                <div className="video-preview">
                  <div className="ratio ratio-16x9">
                    <iframe
                      src={`https://www.youtube.com/embed/${getYouTubeId(video.video)}`}
                      allowFullScreen
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                  </div>
                </div>
                <div className="card-body">
                  <h5 className="card-title text-truncate">{video.titre}</h5>
                  <p className="card-text line-clamp-3">{video.desc}</p>
                  <div className="d-flex justify-content-end gap-2">
                    <button 
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => {
                        setSelectedVideo(video);
                        setShowViewModal(true);
                      }}
                    >
                      <FaEye />
                    </button>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => {
                        setSelectedVideo(video);
                        setEditData(video);
                        setShowEditModal(true);
                      }}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(video._id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination and Modals remain similar with updated form fields */}
        
        {/* Upload Modal */}
        <div className={`modal fade ${showUploadModal ? 'show' : ''}`} style={{ display: showUploadModal ? 'block' : 'none' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Upload Video</h5>
                <button type="button" className="btn-close" onClick={() => setShowUploadModal(false)}></button>
              </div>
              <form onSubmit={handleUpload}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      className={`form-control ${errors.titre ? 'is-invalid' : ''}`}
                      value={newVideo.titre}
                      onChange={(e) => setNewVideo({ ...newVideo, titre: e.target.value })}
                      required
                    />
                    {errors.titre && <div className="invalid-feedback">{errors.titre}</div>}
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className={`form-control ${errors.desc ? 'is-invalid' : ''}`}
                      value={newVideo.desc}
                      onChange={(e) => setNewVideo({ ...newVideo, desc: e.target.value })}
                      rows={4}
                      required
                    />
                    {errors.desc && <div className="invalid-feedback">{errors.desc}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Category</label>
                    <select
                      className={`form-select ${errors.categorie ? 'is-invalid' : ''}`}
                      value={newVideo.categorie}
                      onChange={(e) => setNewVideo({ ...newVideo, categorie: e.target.value })}
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="Bien-être Mental">Mental Well-being</option>
                      <option value="Gestion du Stress">Stress Management</option>
                      <option value="Thérapies et Coaching">Therapies & Coaching</option>
                      <option value="Relations Sociales">Social Relations</option>
                      <option value="Développement Personnel">Personal Development</option>
                    </select>
                    {errors.categorie && <div className="invalid-feedback">{errors.categorie}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">YouTube URL</label>
                    <input
                      type="url"
                      className={`form-control ${errors.video ? 'is-invalid' : ''}`}
                      value={newVideo.video}
                      onChange={(e) => setNewVideo({ ...newVideo, video: e.target.value })}
                      placeholder="https://youtube.com/embed/..."
                      required
                    />
                    {errors.video && <div className="invalid-feedback">{errors.video}</div>}
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary">
                    Upload Video
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* View Modal */}
        <div className={`modal fade ${showViewModal ? 'show' : ''}`} style={{ display: showViewModal ? 'block' : 'none' }}>
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedVideo?.titre}</h5>
                <button type="button" className="btn-close" onClick={() => setShowViewModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="ratio ratio-16x9">
                  <iframe
                    src={selectedVideo ? `https://www.youtube.com/embed/${getYouTubeId(selectedVideo.video)}` : ''}
                    allowFullScreen
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>
                <p className="mt-3">{selectedVideo?.desc}</p>
                <div className="stats mt-3">
                  <span className="badge bg-primary me-2">{selectedVideo?.categorie}</span>
                  <span className="text-muted">Views: {selectedVideo?.viewCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        <div className={`modal fade ${showEditModal ? 'show' : ''}`} style={{ display: showEditModal ? 'block' : 'none' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Video</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>
              <form onSubmit={handleEdit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      className={`form-control ${errors.titre ? 'is-invalid' : ''}`}
                      value={editData.titre || ''}
                      onChange={(e) => setEditData({ ...editData, titre: e.target.value })}
                      required
                    />
                    {errors.titre && <div className="invalid-feedback">{errors.titre}</div>}
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className={`form-control ${errors.desc ? 'is-invalid' : ''}`}
                      value={editData.desc || ''}
                      onChange={(e) => setEditData({ ...editData, desc: e.target.value })}
                      rows={4}
                      required
                    />
                    {errors.desc && <div className="invalid-feedback">{errors.desc}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Category</label>
                    <select
                      className={`form-select ${errors.categorie ? 'is-invalid' : ''}`}
                      value={editData.categorie || ''}
                      onChange={(e) => setEditData({ ...editData, categorie: e.target.value })}
                      required
                    >
                      <option value="Bien-être Mental">Mental Well-being</option>
                      <option value="Gestion du Stress">Stress Management</option>
                      <option value="Thérapies et Coaching">Therapies & Coaching</option>
                      <option value="Relations Sociales">Social Relations</option>
                      <option value="Développement Personnel">Personal Development</option>
                    </select>
                    {errors.categorie && <div className="invalid-feedback">{errors.categorie}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">YouTube URL</label>
                    <input
                      type="url"
                      className={`form-control ${errors.video ? 'is-invalid' : ''}`}
                      value={editData.video || ''}
                      onChange={(e) => setEditData({ ...editData, video: e.target.value })}
                      required
                    />
                    {errors.video && <div className="invalid-feedback">{errors.video}</div>}
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoGallery;