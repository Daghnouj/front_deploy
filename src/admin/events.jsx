import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Edit, Trash2, Eye, Calendar, MapPin, Globe, Tag } from 'lucide-react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Pagination from 'react-bootstrap/Pagination';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './events.css';

const getPhotoUrl = (photos) => {
  if (!photos || photos.length === 0) return null;
  return photos[0]?.startsWith('http') 
    ? photos[0] 
    : `https://deploy-back-3.onrender.com/${photos[0]}`;
};

// Fonction pour redimensionner une image
const resizeImage = (file, maxWidth = 800, maxHeight = 600) => {
  return new Promise((resolve, reject) => {
    if (!file.type.match('image.*')) {
      reject(new Error('Le fichier n\'est pas une image'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculer les nouvelles dimensions en conservant le ratio
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Erreur lors de la conversion du canvas en blob'));
              return;
            }
            resolve(new File([blob], file.name, { 
              type: file.type || 'image/jpeg', 
              lastModified: Date.now() 
            }));
          },
          file.type || 'image/jpeg',
          0.85 // Qualité de compression (0.85 = 85%)
        );
      };
      img.onerror = () => reject(new Error('Échec du chargement de l\'image'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Échec de la lecture du fichier'));
    reader.readAsDataURL(file);
  });
};

function Events() {
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showView, setShowView] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    name: '',
    address: '',
    coordinates: '',
    description: '',
    website: '',
    category: '',
    activities: [{ name: '', day: '' }]
  });
  const [newEventFiles, setNewEventFiles] = useState([]);
  const [editData, setEditData] = useState({});
  const [editEventFiles, setEditEventFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const eventsPerPage = 6;
  const BASE_URL = `https://deploy-back-3.onrender.com/api/events`;

  // Options pour la liste déroulante des catégories
  const categoryOptions = [
    { value: 'sport', label: 'Type de sport' },
    { value: 'price', label: 'Fourchette de prix' },
    { value: 'rating', label: 'Évaluation' }
  ];

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(BASE_URL);
      setEvents(res.data);
    } catch (error) {
      console.error("Error fetching events", error);
    } finally {
      setIsLoading(false);
    }
  }, [BASE_URL]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const validateForm = (formData, files, isNew = false) => {
    const newErrors = {};
    
    if (!formData.name?.trim()) newErrors.name = 'Nom requis';
    if (!formData.address?.trim()) newErrors.address = 'Adresse requise';
    if (!formData.description?.trim()) newErrors.description = 'Description requise';
    
    // Validation des activités
    if (!formData.activities || formData.activities.length === 0) {
      newErrors.activities = 'Au moins une activité est requise';
    } else {
      formData.activities.forEach((activity, index) => {
        if (!activity.name?.trim()) {
          newErrors[`activityName_${index}`] = 'Nom activité requis';
        }
        if (!activity.day?.trim()) {
          newErrors[`activityDay_${index}`] = 'Jour activité requis';
        }
      });
    }
    
    // Validation des images
    if (isNew && (!files || files.length !== 4)) {
      newErrors.images = '4 images requises';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddEvent = async () => {
    if (validateForm(newEvent, newEventFiles, true)) {
      try {
        // Redimensionner toutes les images avant envoi
        const resizedFiles = await Promise.all(
          newEventFiles.map(file => 
            resizeImage(file).catch(e => {
              console.error("Erreur de redimensionnement, utilisation de l'original", e);
              return file;
            })
          )
        );

        const formData = new FormData();
        
        // Ajouter les champs texte
        formData.append('name', newEvent.name);
        formData.append('address', newEvent.address);
        formData.append('coordinates', newEvent.coordinates);
        formData.append('description', newEvent.description);
        formData.append('website', newEvent.website);
        formData.append('category', newEvent.category);
        formData.append('activities', JSON.stringify(newEvent.activities));
        
        // Ajouter les fichiers redimensionnés
        resizedFiles.forEach(file => {
          formData.append('photo', file);
        });

        await axios.post(BASE_URL, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        await fetchEvents();
        setShowAdd(false);
        resetForms();
      } catch (error) {
        console.error("Error creating event", error);
      }
    }
  };

  const handleEditEvent = async () => {
    if (validateForm(editData, editEventFiles)) {
      try {
        const formData = new FormData();
        
        // Ajouter les champs texte
        formData.append('name', editData.name);
        formData.append('address', editData.address);
        formData.append('coordinates', editData.coordinates);
        formData.append('description', editData.description);
        formData.append('website', editData.website);
        formData.append('category', editData.category);
        formData.append('activities', JSON.stringify(editData.activities));
        
        // Redimensionner et ajouter les nouveaux fichiers s'il y en a
        if (editEventFiles.length > 0) {
          const resizedFiles = await Promise.all(
            editEventFiles.map(file => 
              resizeImage(file).catch(e => {
                console.error("Erreur de redimensionnement, utilisation de l'original", e);
                return file;
              })
            )
          );
          
          resizedFiles.forEach(file => {
            formData.append('photo', file);
          });
        }

        await axios.put(`${BASE_URL}/${selectedEvent._id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        await fetchEvents();
        setShowEdit(false);
        resetForms();
      } catch (error) {
        console.error("Error updating event", error);
      }
    }
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm('Supprimer cet événement ?')) {
      try {
        await axios.delete(`${BASE_URL}/${id}`);
        await fetchEvents();
        
        // Reset to first page if current page is empty
        const totalPages = Math.ceil((events.length - 1) / eventsPerPage);
        if (page > totalPages && totalPages > 0) {
          setPage(totalPages);
        }
      } catch (error) {
        console.error("Error deleting event", error);
      }
    }
  };

  const resetForms = () => {
    setNewEvent({
      name: '',
      address: '',
      coordinates: '',
      description: '',
      website: '',
      category: '',
      activities: [{ name: '', day: '' }]
    });
    setNewEventFiles([]);
    setEditData({});
    setEditEventFiles([]);
    setErrors({});
  };

  // Gestion des activités
  const addActivity = (isNew = true) => {
    if (isNew) {
      setNewEvent({
        ...newEvent,
        activities: [...newEvent.activities, { name: '', day: '' }]
      });
    } else {
      setEditData({
        ...editData,
        activities: [...editData.activities, { name: '', day: '' }]
      });
    }
  };

  const removeActivity = (index, isNew = true) => {
    if (isNew) {
      const updatedActivities = [...newEvent.activities];
      updatedActivities.splice(index, 1);
      setNewEvent({
        ...newEvent,
        activities: updatedActivities
      });
    } else {
      const updatedActivities = [...editData.activities];
      updatedActivities.splice(index, 1);
      setEditData({
        ...editData,
        activities: updatedActivities
      });
    }
  };

  const handleActivityChange = (index, field, value, isNew = true) => {
    if (isNew) {
      const updatedActivities = [...newEvent.activities];
      updatedActivities[index][field] = value;
      setNewEvent({
        ...newEvent,
        activities: updatedActivities
      });
    } else {
      const updatedActivities = [...editData.activities];
      updatedActivities[index][field] = value;
      setEditData({
        ...editData,
        activities: updatedActivities
      });
    }
  };

  // Pagination calculations
  const indexOfLast = page * eventsPerPage;
  const indexOfFirst = indexOfLast - eventsPerPage;
  const currentEvents = events.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(events.length / eventsPerPage);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Pagination items
  const paginationItems = [];
  for (let i = 1; i <= totalPages; i++) {
    paginationItems.push(
      <Pagination.Item 
        key={i} 
        active={i === page}
        onClick={() => handlePageChange(i)}
      >
        {i}
      </Pagination.Item>
    );
  }

  // Formatteur d'activités pour l'affichage
  const formatActivities = (activities) => {
    if (!activities || activities.length === 0) return 'Aucune activité';
    return activities.map(a => `${a.name} (${a.day})`).join(', ');
  };

  // Trouver le libellé de la catégorie
  const getCategoryLabel = (value) => {
    const category = categoryOptions.find(opt => opt.value === value);
    return category ? category.label : value;
  };

  return (
    <Container className="admin-events-container py-5">
      <div className="admin-events-header d-flex justify-content-between align-items-center mb-5">
        <h1 className="admin-events-title fw-bold">Gestion des Événements</h1>
        <Button variant="primary" onClick={() => setShowAdd(true)} className="admin-events-add-btn">
          <Calendar size={20} className="me-2" />
          Nouvel Événement
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-5">
          <h4 className="text-muted">Aucun événement disponible</h4>
          <Button variant="primary" onClick={() => setShowAdd(true)} className="mt-3">
            Créer un nouvel événement
          </Button>
        </div>
      ) : (
        <>
          <Row className="admin-events-grid g-4">
            {currentEvents.map(event => (
              <Col key={event._id} md={6} lg={4}>
                <Card className="admin-event-card h-100 shadow-sm">
                  <Card.Img 
                    variant="top" 
                    src={getPhotoUrl(event.images)} 
                    className="admin-event-image"
                    alt={event.name}
                  />
                  <Card.Body className="admin-event-body">
                    <Card.Title className="admin-event-title text-truncate">{event.name}</Card.Title>
                    <div className="admin-event-details text-muted">
                      <div className="d-flex align-items-center mb-2">
                        <MapPin size={18} className="me-2" />
                        <small className="text-truncate">{event.address}</small>
                      </div>
                      <div className="d-flex align-items-center">
                        <Tag size={18} className="me-2" />
                        <small className="text-truncate">
                          {getCategoryLabel(event.category) || 'Aucune catégorie'}
                        </small>
                      </div>
                    </div>
                    <div className="admin-event-actions d-flex justify-content-end gap-2 mt-3">
                      <Button 
                        variant="outline-secondary" 
                        size="sm"
                        onClick={() => {
                          setSelectedEvent(event);
                          setShowView(true);
                        }}
                      >
                        <Eye size={16} />
                      </Button>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => {
                          setSelectedEvent(event);
                          setEditData({ 
                            ...event,
                            activities: event.activities.map(a => ({ ...a }))
                          });
                          setShowEdit(true);
                        }}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteEvent(event._id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {totalPages > 1 && (
            <div className="admin-events-pagination d-flex justify-content-center mt-5">
              <Pagination className="admin-pagination">
                <Pagination.Prev 
                  disabled={page === 1} 
                  onClick={() => handlePageChange(page - 1)} 
                />
                {paginationItems}
                <Pagination.Next 
                  disabled={page === totalPages} 
                  onClick={() => handlePageChange(page + 1)} 
                />
              </Pagination>
            </div>
          )}
        </>
      )}

      {/* Add Modal */}
      <Modal show={showAdd} onHide={() => setShowAdd(false)} className="admin-modal">
        <Modal.Header closeButton className="admin-modal-header">
          <Modal.Title className="admin-modal-title">Nouvel Événement</Modal.Title>
        </Modal.Header>
        <Modal.Body className="admin-modal-body">
          <Form className="admin-event-form">
            <Form.Group className="admin-form-group mb-3">
              <Form.Label className="admin-form-label">Nom de l'événement*</Form.Label>
              <Form.Control
                value={newEvent.name}
                onChange={(e) => setNewEvent({...newEvent, name: e.target.value})}
                isInvalid={!!errors.name}
              />
              <Form.Control.Feedback type="invalid">
                {errors.name}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="admin-form-group mb-3">
              <Form.Label className="admin-form-label">Adresse*</Form.Label>
              <Form.Control
                value={newEvent.address}
                onChange={(e) => setNewEvent({...newEvent, address: e.target.value})}
                isInvalid={!!errors.address}
              />
              <Form.Control.Feedback type="invalid">
                {errors.address}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="admin-form-group mb-3">
              <Form.Label className="admin-form-label">Coordonnées</Form.Label>
              <Form.Control
                value={newEvent.coordinates}
                onChange={(e) => setNewEvent({...newEvent, coordinates: e.target.value})}
                placeholder="Ex: 48.8566, 2.3522"
              />
            </Form.Group>

            <Form.Group className="admin-form-group mb-3">
              <Form.Label className="admin-form-label">Site web</Form.Label>
              <Form.Control
                type="url"
                value={newEvent.website}
                onChange={(e) => setNewEvent({...newEvent, website: e.target.value})}
                placeholder="https://exemple.com"
              />
            </Form.Group>

            <Form.Group className="admin-form-group mb-3">
              <Form.Label className="admin-form-label">Catégorie</Form.Label>
              <Form.Select
                value={newEvent.category}
                onChange={(e) => setNewEvent({...newEvent, category: e.target.value})}
              >
                <option value="">Sélectionner une catégorie</option>
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="admin-form-group mb-3">
              <Form.Label className="admin-form-label">
                Images (4 obligatoires)*
              </Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setNewEventFiles(Array.from(e.target.files))}
                isInvalid={!!errors.images}
              />
              <div className="mt-2 d-flex flex-wrap gap-2">
                {newEventFiles.map((file, index) => (
                  <img 
                    key={index}
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index}`}
                    className="img-preview"
                  />
                ))}
              </div>
              <Form.Control.Feedback type="invalid">
                {errors.images}
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                Sélectionnez exactement 4 images (elles seront automatiquement redimensionnées)
              </Form.Text>
            </Form.Group>

            <Form.Group className="admin-form-group mb-3">
              <Form.Label className="admin-form-label">Description*</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newEvent.description}
                onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                isInvalid={!!errors.description}
              />
              <Form.Control.Feedback type="invalid">
                {errors.description}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="admin-form-group mb-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Form.Label className="admin-form-label mb-0">Activités*</Form.Label>
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={() => addActivity(true)}
                >
                  Ajouter une activité
                </Button>
              </div>
              
              {newEvent.activities.map((activity, index) => (
                <div key={index} className="activity-group mb-2">
                  <div className="d-flex gap-2 mb-2">
                    <Form.Control
                      placeholder="Nom de l'activité"
                      value={activity.name}
                      onChange={(e) => handleActivityChange(index, 'name', e.target.value, true)}
                      isInvalid={!!errors[`activityName_${index}`]}
                    />
                    <Form.Control
                      placeholder="Jour (ex: Lundi 12 Juin)"
                      value={activity.day}
                      onChange={(e) => handleActivityChange(index, 'day', e.target.value, true)}
                      isInvalid={!!errors[`activityDay_${index}`]}
                    />
                    <Button 
                      variant="outline-danger" 
                      onClick={() => removeActivity(index, true)}
                      disabled={newEvent.activities.length <= 1}
                    >
                      Supprimer
                    </Button>
                  </div>
                  {(errors[`activityName_${index}`] || errors[`activityDay_${index}`]) && (
                    <div className="d-flex gap-2 mb-2">
                      {errors[`activityName_${index}`] && (
                        <div className="text-danger small">{errors[`activityName_${index}`]}</div>
                      )}
                      {errors[`activityDay_${index}`] && (
                        <div className="text-danger small">{errors[`activityDay_${index}`]}</div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {errors.activities && (
                <div className="text-danger">{errors.activities}</div>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="admin-modal-footer">
          <Button variant="secondary" onClick={() => setShowAdd(false)}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleAddEvent}>
            Publier
          </Button>
        </Modal.Footer>
      </Modal>

      {/* View Modal */}
      <Modal show={showView} onHide={() => setShowView(false)} className="admin-modal" size="lg">
        <Modal.Header closeButton className="admin-modal-header">
          <Modal.Title className="admin-modal-title">{selectedEvent?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="admin-modal-body">
          {selectedEvent && (
            <>
              <div className="event-images-grid mb-4">
                {selectedEvent.images?.map((img, index) => (
                  <img 
                    key={index}
                    src={getPhotoUrl([img])}
                    alt={`${selectedEvent.name} ${index + 1}`}
                    className="event-modal-image"
                  />
                ))}
              </div>
              
              <div className="admin-event-modal-details d-flex flex-column gap-3">
                <div className="d-flex align-items-center">
                  <MapPin size={20} className="me-3" />
                  <span>{selectedEvent.address}</span>
                </div>

                {selectedEvent.coordinates && (
                  <div className="d-flex align-items-center">
                    <MapPin size={20} className="me-3" />
                    <span>Coordonnées: {selectedEvent.coordinates}</span>
                  </div>
                )}

                {selectedEvent.website && (
                  <div className="d-flex align-items-center">
                    <Globe size={20} className="me-3" />
                    <a href={selectedEvent.website} target="_blank" rel="noopener noreferrer">
                      {selectedEvent.website}
                    </a>
                  </div>
                )}

                {selectedEvent.category && (
                  <div className="d-flex align-items-center">
                    <Tag size={20} className="me-3" />
                    <span>{getCategoryLabel(selectedEvent.category)}</span>
                  </div>
                )}

                <div className="d-flex align-items-start">
                  <Calendar size={20} className="me-3 mt-1" />
                  <div>
                    <h5>Activités:</h5>
                    <ul className="mt-2">
                      {selectedEvent.activities?.map((activity, index) => (
                        <li key={index}>
                          <strong>{activity.name}</strong> - {activity.day}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {selectedEvent.description && (
                  <div className="mt-2">
                    <h5>Description</h5>
                    <p className="admin-event-description mt-2">{selectedEvent.description}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEdit} onHide={() => setShowEdit(false)} className="admin-modal">
        <Modal.Header closeButton className="admin-modal-header">
          <Modal.Title className="admin-modal-title">Modifier l'Événement</Modal.Title>
        </Modal.Header>
        <Modal.Body className="admin-modal-body">
          {selectedEvent && (
            <Form className="admin-event-form">
              <Form.Group className="admin-form-group mb-3">
                <Form.Label className="admin-form-label">Nom de l'événement*</Form.Label>
                <Form.Control
                  value={editData.name || ''}
                  onChange={(e) => setEditData({...editData, name: e.target.value})}
                  isInvalid={!!errors.name}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="admin-form-group mb-3">
                <Form.Label className="admin-form-label">Adresse*</Form.Label>
                <Form.Control
                  value={editData.address || ''}
                  onChange={(e) => setEditData({...editData, address: e.target.value})}
                  isInvalid={!!errors.address}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.address}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="admin-form-group mb-3">
                <Form.Label className="admin-form-label">Coordonnées</Form.Label>
                <Form.Control
                  value={editData.coordinates || ''}
                  onChange={(e) => setEditData({...editData, coordinates: e.target.value})}
                  placeholder="Ex: 48.8566, 2.3522"
                />
              </Form.Group>

              <Form.Group className="admin-form-group mb-3">
                <Form.Label className="admin-form-label">Site web</Form.Label>
                <Form.Control
                  type="url"
                  value={editData.website || ''}
                  onChange={(e) => setEditData({...editData, website: e.target.value})}
                  placeholder="https://exemple.com"
                />
              </Form.Group>

              <Form.Group className="admin-form-group mb-3">
                <Form.Label className="admin-form-label">Catégorie</Form.Label>
                <Form.Select
                  value={editData.category || ''}
                  onChange={(e) => setEditData({...editData, category: e.target.value})}
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categoryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="admin-form-group mb-3">
                <Form.Label className="admin-form-label">
                  Nouvelles images (optionnel)
                </Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setEditEventFiles(Array.from(e.target.files))}
                />
                <div className="mt-2 d-flex flex-wrap gap-2">
                  {editEventFiles.map((file, index) => (
                    <img 
                      key={index}
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index}`}
                      className="img-preview"
                    />
                  ))}
                </div>
                <Form.Text className="text-muted">
                  Laisser vide pour conserver les images actuelles. Si vous changez, sélectionnez exactement 4 images (elles seront automatiquement redimensionnées).
                </Form.Text>
              </Form.Group>

              <Form.Group className="admin-form-group mb-3">
                <Form.Label className="admin-form-label">Description*</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={editData.description || ''}
                  onChange={(e) => setEditData({...editData, description: e.target.value})}
                  isInvalid={!!errors.description}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.description}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="admin-form-group mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <Form.Label className="admin-form-label mb-0">Activités*</Form.Label>
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => addActivity(false)}
                  >
                    Ajouter une activité
                  </Button>
                </div>
                
                {editData.activities?.map((activity, index) => (
                  <div key={index} className="activity-group mb-2">
                    <div className="d-flex gap-2 mb-2">
                      <Form.Control
                        placeholder="Nom de l'activité"
                        value={activity.name}
                        onChange={(e) => handleActivityChange(index, 'name', e.target.value, false)}
                        isInvalid={!!errors[`activityName_${index}`]}
                      />
                      <Form.Control
                        placeholder="Jour (ex: Lundi 12 Juin)"
                        value={activity.day}
                        onChange={(e) => handleActivityChange(index, 'day', e.target.value, false)}
                        isInvalid={!!errors[`activityDay_${index}`]}
                      />
                      <Button 
                        variant="outline-danger" 
                        onClick={() => removeActivity(index, false)}
                        disabled={editData.activities.length <= 1}
                      >
                        Supprimer
                      </Button>
                    </div>
                    {(errors[`activityName_${index}`] || errors[`activityDay_${index}`]) && (
                      <div className="d-flex gap-2 mb-2">
                        {errors[`activityName_${index}`] && (
                          <div className="text-danger small">{errors[`activityName_${index}`]}</div>
                        )}
                        {errors[`activityDay_${index}`] && (
                          <div className="text-danger small">{errors[`activityDay_${index}`]}</div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                {errors.activities && (
                  <div className="text-danger">{errors.activities}</div>
                )}
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer className="admin-modal-footer">
          <Button variant="secondary" onClick={() => setShowEdit(false)}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleEditEvent}>
            Enregistrer
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Events;